-- Phase 2D: profiles — one row per auth.users row, holds the platform role
-- and member-facing details. Trainer is intentionally not a role here;
-- Trainer authentication is deferred past Phase 2 per the roadmap.

create type public.user_role as enum ('owner', 'manager', 'receptionist', 'member');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'member',
  full_name text not null default '',
  email text not null,
  phone text,
  date_of_birth date,
  gender text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'One row per auth.users row. Created automatically by handle_new_user(). Role drives lib/permissions authorization checks.';
comment on column public.profiles.status is
  'Profile-level active/inactive flag (e.g. a departed staff member), distinct from a member''s membership status in public.memberships.';

create index profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Returns the caller's role without re-triggering RLS on profiles (SECURITY
-- DEFINER bypasses RLS inside the function body). This is what every other
-- table's policies call instead of querying profiles directly, which would
-- otherwise recurse into profiles' own RLS policies below.
create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

comment on function public.current_user_role() is
  'SECURITY DEFINER helper so RLS policies on other tables can check the caller''s role without querying profiles directly (which would recurse into profiles'' own RLS).';

-- Every account is created by the platform, never by public self-signup
-- (see business rules: post-payment or receptionist/owner walk-in creation).
-- This trigger just keeps profiles in sync with whatever auth.users row a
-- later phase creates (via supabase.auth.admin.createUser /
-- inviteUserByEmail), reading optional metadata the creator can pass in.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'member')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role/status are authorization-critical, so — unlike the rest of a
-- profile — they can't be changed via the same "user can update their own
-- row" policy below. Only Owner/Manager may change them, regardless of
-- whose row is being updated.
create or replace function public.prevent_unauthorized_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role or new.status is distinct from old.status) then
    if public.current_user_role() not in ('owner', 'manager') then
      raise exception 'Only Owner or Manager can change role or status';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role_change
  before update on public.profiles
  for each row execute function public.prevent_unauthorized_role_change();

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_staff"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

-- Column-level protection for role/status is enforced by the trigger above,
-- not by this policy (Postgres RLS can't restrict individual columns).
create policy "profiles_update_own_or_staff"
  on public.profiles for update
  to authenticated
  using (
    id = auth.uid()
    or public.current_user_role() in ('owner', 'manager')
  );

-- No insert policy for the authenticated/anon roles: rows are created only
-- by the handle_new_user() trigger (SECURITY DEFINER, runs as the table
-- owner) or directly by the service role, never by a client-side insert.
-- No delete policy: profiles are never hard-deleted from the app.
