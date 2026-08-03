-- Phase 2D: announcements — studio-wide notices shown in the member portal.

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index announcements_published_idx on public.announcements (is_published, published_at desc);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;

create policy "announcements_select_published_or_staff"
  on public.announcements for select
  to authenticated
  using (
    is_published = true
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

create policy "announcements_manage_owner_manager"
  on public.announcements for all
  to authenticated
  using (public.current_user_role() in ('owner', 'manager'))
  with check (public.current_user_role() in ('owner', 'manager'));
