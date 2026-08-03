-- Phase 2D: memberships — a member's enrollment in a plan for a period.
-- Created in 'pending' status; a verified payment (Phase 2G) or a staff
-- walk-in/offline flow moves it to 'active'.

create type public.membership_status as enum (
  'pending', 'active', 'frozen', 'cancelled', 'expired'
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  plan_id uuid not null references public.membership_plans (id) on delete restrict,
  status public.membership_status not null default 'pending',
  start_date date,
  end_date date,
  auto_renew boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_dates_check check (
    start_date is null or end_date is null or end_date >= start_date
  )
);

comment on table public.memberships is
  'A member''s enrollment in a plan for a period. created_by records the staff member for walk-in signups; null for self-serve online checkout.';

-- A member can have historical (expired/cancelled) memberships, but only
-- one ACTIVE (or pending-payment) membership at a time — this is the
-- database-level half of "prevent duplicate memberships" from the roadmap's
-- security section; the API layer (Phase 2G) enforces the rest at
-- checkout time.
create unique index memberships_one_open_per_member_idx
  on public.memberships (member_id)
  where status in ('pending', 'active');

create index memberships_plan_id_idx on public.memberships (plan_id);
create index memberships_status_idx on public.memberships (status);

create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

alter table public.memberships enable row level security;

create policy "memberships_select_own_or_staff"
  on public.memberships for select
  to authenticated
  using (
    member_id = auth.uid()
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

-- Members never insert/update their own membership row directly — creation
-- and status changes go through the verified-payment webhook or a staff
-- action (both server-side), never a direct client write.
create policy "memberships_insert_staff"
  on public.memberships for insert
  to authenticated
  with check (public.current_user_role() in ('owner', 'manager', 'receptionist'));

create policy "memberships_update_staff"
  on public.memberships for update
  to authenticated
  using (public.current_user_role() in ('owner', 'manager', 'receptionist'))
  with check (public.current_user_role() in ('owner', 'manager', 'receptionist'));

-- No delete policy: memberships are never hard-deleted (status transitions
-- to 'cancelled'/'expired' instead, preserving history for reporting).
