-- Phase 2D: payments — one row per attempted charge (online via Razorpay,
-- or offline recorded by staff). plan_id is denormalized from the
-- membership at time of payment so the amount charged stays accurate even
-- if the plan's price changes later.

create type public.payment_status as enum (
  'created', 'authorized', 'captured', 'failed', 'refunded'
);

create type public.payment_method as enum ('online', 'offline');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid not null references public.membership_plans (id) on delete restrict,
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  method public.payment_method not null,
  status public.payment_status not null default 'created',
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  razorpay_signature text,
  recorded_by uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_online_needs_order check (
    method = 'offline' or razorpay_order_id is not null
  )
);

comment on table public.payments is
  'One row per charge attempt. The unique constraints on razorpay_order_id/razorpay_payment_id are the "prevent duplicate payments" control: a replayed webhook for the same order/payment id cannot insert a second row.';

create index payments_membership_id_idx on public.payments (membership_id);
create index payments_member_id_idx on public.payments (member_id);
create index payments_status_idx on public.payments (status);

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

create policy "payments_select_own_or_staff"
  on public.payments for select
  to authenticated
  using (
    member_id = auth.uid()
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

-- Client-authenticated inserts are for the offline-payment workflow only
-- (receptionist/owner recording cash/card-terminal payment at the desk).
-- Online payments are written by the Razorpay order-creation route and
-- signature-verified webhook (Phase 2G) using the service-role client in
-- lib/supabase/admin.ts, which bypasses RLS entirely — so no 'online'
-- insert/update policy is needed here for the authenticated role.
create policy "payments_insert_staff_offline"
  on public.payments for insert
  to authenticated
  with check (
    method = 'offline'
    and public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

create policy "payments_update_staff"
  on public.payments for update
  to authenticated
  using (public.current_user_role() in ('owner', 'manager', 'receptionist'))
  with check (public.current_user_role() in ('owner', 'manager', 'receptionist'));

-- No delete policy: payment records are never removed (financial audit trail).
