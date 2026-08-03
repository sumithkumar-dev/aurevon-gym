-- Phase 2D: extensions + generic helpers shared by every table below.
-- No business logic — just plumbing every later migration depends on.

-- gen_random_uuid() for all primary keys.
create extension if not exists pgcrypto;

-- Generic "touch updated_at on every UPDATE" trigger function, attached to
-- each table that has an updated_at column instead of re-implementing this
-- per table.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Generic BEFORE UPDATE trigger: stamps updated_at = now() on every row update.';
