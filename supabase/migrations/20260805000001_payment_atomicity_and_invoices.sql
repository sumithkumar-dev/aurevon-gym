-- Phase 2G audit fix: three correctness gaps found in the payments flow
-- during the production audit —
--
-- 1. `lib/razorpay/webhooks.ts` previously wrote the membership-activation
--    and payment-capture updates as two separate service-role calls. A
--    delivery that failed between them (network blip, function timeout)
--    would leave the payment in a non-terminal status; Razorpay's retry
--    would then re-run both writes from scratch, silently re-computing
--    `start_date`/`end_date` from "today" a second time and quietly
--    extending the membership. Not atomic, and not safely retryable.
-- 2. The same handler treated `status = 'failed'` as a terminal state
--    alongside `'captured'`. Razorpay allows multiple payment attempts
--    against one order — a member whose first attempt fails and who
--    successfully retries the *same* order would have their successful
--    `payment.captured` event silently ignored, because the row was
--    already marked `'failed'` from the first attempt. Money captured,
--    membership never activated.
-- 3. No code path — online or offline — ever inserted a row into
--    `public.invoices`, despite `features/member/payments` and
--    `features/admin/members` both being built to read and display one.
--    The table was permanently empty in practice.
--
-- Fix: move the write side of both the online (webhook) and offline
-- (staff-recorded) payment flows into two SECURITY DEFINER functions that
-- each do their reads, writes, and invoice insert as a single statement
-- batch inside one Postgres transaction, with `for update` row locks so a
-- concurrent/replayed call can't interleave with itself. Application code
-- (`lib/razorpay/webhooks.ts`, `features/admin/payments/actions.ts`) now
-- calls these instead of issuing the writes itself.

-- ---------------------------------------------------------------------
-- activate_membership_from_payment — the payment.captured path.
-- Idempotent: a payment already 'captured' is a no-op success (a
-- replayed webhook delivery), never re-processed. A payment previously
-- 'failed' is NOT treated as terminal — it's allowed to transition to
-- 'captured', which is what a successful retry on the same order needs.
-- ---------------------------------------------------------------------
create or replace function public.activate_membership_from_payment(
  p_payment_id uuid,
  p_razorpay_payment_id text
)
returns table (membership_id uuid, invoice_id uuid, already_captured boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment record;
  v_membership record;
  v_plan record;
  v_start date;
  v_end date;
  v_invoice_id uuid;
begin
  select * into v_payment
    from public.payments
    where id = p_payment_id
    for update;

  if not found then
    raise exception 'ERR_PAYMENT_NOT_FOUND: payment % not found', p_payment_id;
  end if;

  if v_payment.status = 'captured' then
    -- Replayed delivery (or a race with a concurrent call for the same
    -- payment) — report success without redoing the work.
    select i.id into v_invoice_id from public.invoices i where i.payment_id = v_payment.id;
    return query select v_payment.membership_id, v_invoice_id, true;
    return;
  end if;

  select * into v_membership
    from public.memberships
    where id = v_payment.membership_id
    for update;

  if not found then
    raise exception 'ERR_MEMBERSHIP_NOT_FOUND: membership % not found', v_payment.membership_id;
  end if;

  select * into v_plan
    from public.membership_plans
    where id = v_membership.plan_id;

  if not found then
    raise exception 'ERR_PLAN_NOT_FOUND: plan % not found', v_membership.plan_id;
  end if;

  v_start := current_date;
  v_end := current_date + v_plan.duration_days;

  update public.memberships
    set status = 'active', start_date = v_start, end_date = v_end
    where id = v_membership.id;

  update public.payments
    set status = 'captured', razorpay_payment_id = p_razorpay_payment_id
    where id = v_payment.id;

  insert into public.invoices (payment_id, member_id, amount_paise)
    values (v_payment.id, v_payment.member_id, v_payment.amount_paise)
    on conflict (payment_id) do nothing
    returning id into v_invoice_id;

  if v_invoice_id is null then
    -- Row already existed (shouldn't happen given the status guard above,
    -- but keeps this function safe to call twice under any race).
    select i.id into v_invoice_id from public.invoices i where i.payment_id = v_payment.id;
  end if;

  return query select v_membership.id, v_invoice_id, false;
end;
$$;

comment on function public.activate_membership_from_payment(uuid, text) is
  'Atomically activates a membership, marks its payment captured, and issues an invoice for a verified Razorpay payment.captured webhook. Row-locks the payment first so replayed/concurrent deliveries cannot double-process. Only ever called with the service-role client (lib/supabase/admin.ts) from a signature-verified webhook handler — never exposed to a member-facing client.';

revoke all on function public.activate_membership_from_payment(uuid, text) from public, anon, authenticated;
grant execute on function public.activate_membership_from_payment(uuid, text) to service_role;

-- ---------------------------------------------------------------------
-- mark_payment_failed — the payment.failed path. Row-locked so it can
-- never downgrade a payment a concurrent/later 'captured' event already
-- finalized (out-of-order webhook delivery).
-- ---------------------------------------------------------------------
create or replace function public.mark_payment_failed(
  p_payment_id uuid,
  p_razorpay_payment_id text
)
returns table (updated boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment record;
begin
  select * into v_payment
    from public.payments
    where id = p_payment_id
    for update;

  if not found then
    raise exception 'ERR_PAYMENT_NOT_FOUND: payment % not found', p_payment_id;
  end if;

  if v_payment.status = 'captured' then
    -- Never let a late/out-of-order failed event undo a real capture.
    return query select false;
    return;
  end if;

  update public.payments
    set status = 'failed', razorpay_payment_id = p_razorpay_payment_id
    where id = v_payment.id;

  return query select true;
end;
$$;

comment on function public.mark_payment_failed(uuid, text) is
  'Marks a payment failed for a verified Razorpay payment.failed webhook, unless it was already captured (out-of-order delivery) — capture always wins.';

revoke all on function public.mark_payment_failed(uuid, text) from public, anon, authenticated;
grant execute on function public.mark_payment_failed(uuid, text) to service_role;

-- ---------------------------------------------------------------------
-- record_offline_payment — the staff walk-in / cash-or-terminal path
-- (features/admin/payments/actions.ts). Bundles the same
-- membership-create-or-activate logic that route already had, plus the
-- payment and invoice rows, into one transaction. SECURITY DEFINER so it
-- can also write `invoices` (no client-facing insert policy exists on
-- that table by design) — the role check below is the authorization
-- control in place of RLS, mirroring `prevent_unauthorized_role_change()`.
-- ---------------------------------------------------------------------
create or replace function public.record_offline_payment(
  p_member_id uuid,
  p_plan_id uuid,
  p_recorded_by uuid,
  p_notes text
)
returns table (membership_id uuid, payment_id uuid, invoice_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan record;
  v_open_membership record;
  v_membership_id uuid;
  v_payment_id uuid;
  v_invoice_id uuid;
  v_start date;
  v_end date;
begin
  if public.current_user_role() not in ('owner', 'manager', 'receptionist') then
    raise exception 'ERR_FORBIDDEN: only staff can record an offline payment';
  end if;

  select * into v_plan from public.membership_plans where id = p_plan_id;
  if not found or v_plan.is_active is not true then
    raise exception 'ERR_INVALID_PLAN: plan % is not a valid, active plan', p_plan_id;
  end if;

  select * into v_open_membership
    from public.memberships
    where member_id = p_member_id and status in ('pending', 'active')
    for update;

  v_start := current_date;
  v_end := current_date + v_plan.duration_days;

  if found then
    if v_open_membership.status = 'active' then
      raise exception 'ERR_ALREADY_ACTIVE: member already has an active membership';
    end if;
    if v_open_membership.plan_id <> v_plan.id then
      raise exception 'ERR_PLAN_MISMATCH: member has a pending membership for a different plan';
    end if;

    update public.memberships
      set status = 'active', start_date = v_start, end_date = v_end
      where id = v_open_membership.id;
    v_membership_id := v_open_membership.id;
  else
    v_membership_id := gen_random_uuid();
    insert into public.memberships
      (id, member_id, plan_id, status, start_date, end_date, created_by)
    values
      (v_membership_id, p_member_id, v_plan.id, 'active', v_start, v_end, p_recorded_by);
  end if;

  v_payment_id := gen_random_uuid();
  insert into public.payments
    (id, membership_id, member_id, plan_id, amount_paise, method, status, recorded_by, notes)
  values
    (v_payment_id, v_membership_id, p_member_id, v_plan.id, v_plan.price_paise, 'offline', 'captured', p_recorded_by, p_notes);

  insert into public.invoices (payment_id, member_id, amount_paise)
    values (v_payment_id, p_member_id, v_plan.price_paise)
    returning id into v_invoice_id;

  return query select v_membership_id, v_payment_id, v_invoice_id;
end;
$$;

comment on function public.record_offline_payment(uuid, uuid, uuid, text) is
  'Atomically records a staff-taken offline payment: creates or activates the membership, inserts the payment, and issues an invoice, in one transaction. Re-checks the caller''s staff role itself (SECURITY DEFINER bypasses RLS) so this can never be used to write payments/invoices as a non-staff caller even if called directly.';

revoke all on function public.record_offline_payment(uuid, uuid, uuid, text) from public, anon;
grant execute on function public.record_offline_payment(uuid, uuid, uuid, text) to authenticated, service_role;
