-- Phase 2D: gallery + trainers — content tables that eventually replace the
-- static arrays in lib/site-data.ts (see features/admin/README.md's
-- "content" sub-area). Not wired to the public site yet — Phase 1's
-- /gallery and /trainers pages keep reading from lib/site-data.ts until
-- features/admin/content ships.

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index gallery_published_sort_idx on public.gallery (is_published, sort_order);

create table public.trainers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text not null,
  bio text not null default '',
  photo_url text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index trainers_published_sort_idx on public.trainers (is_published, sort_order);

create trigger trainers_set_updated_at
  before update on public.trainers
  for each row execute function public.set_updated_at();

alter table public.gallery enable row level security;
alter table public.trainers enable row level security;

-- Public content: readable without auth once the public pages are wired to
-- these tables, same as membership_plans.
create policy "gallery_select_published_or_staff"
  on public.gallery for select
  to anon, authenticated
  using (
    is_published = true
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

create policy "gallery_manage_owner_manager"
  on public.gallery for all
  to authenticated
  using (public.current_user_role() in ('owner', 'manager'))
  with check (public.current_user_role() in ('owner', 'manager'));

create policy "trainers_select_published_or_staff"
  on public.trainers for select
  to anon, authenticated
  using (
    is_published = true
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

create policy "trainers_manage_owner_manager"
  on public.trainers for all
  to authenticated
  using (public.current_user_role() in ('owner', 'manager'))
  with check (public.current_user_role() in ('owner', 'manager'));
