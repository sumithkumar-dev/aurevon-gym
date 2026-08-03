-- Phase 2D: membership_plans. `lib/site-data.ts` / `components/ui/pricing-card.tsx`
-- remain the source of truth for the public /membership page until
-- features/admin/content replaces it (see lib/site-data.ts's comment) —
-- this table is prepared ahead of that, seeded with the same real plans so
-- it isn't empty scaffolding.

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_paise integer not null check (price_paise > 0),
  duration_days integer not null check (duration_days > 0),
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.membership_plans is
  'Purchasable plans. price_paise is the Razorpay-native unit (INR paise) to avoid float rounding at checkout time.';

create trigger membership_plans_set_updated_at
  before update on public.membership_plans
  for each row execute function public.set_updated_at();

alter table public.membership_plans enable row level security;

-- Public pricing needs to be readable without auth (anon) once the public
-- site is wired to this table; staff additionally see inactive/draft plans.
create policy "membership_plans_select_active_or_staff"
  on public.membership_plans for select
  to anon, authenticated
  using (
    is_active = true
    or public.current_user_role() in ('owner', 'manager', 'receptionist')
  );

create policy "membership_plans_manage_owner_manager"
  on public.membership_plans for all
  to authenticated
  using (public.current_user_role() in ('owner', 'manager'))
  with check (public.current_user_role() in ('owner', 'manager'));

insert into public.membership_plans
  (slug, name, description, price_paise, duration_days, features, is_active, is_featured, sort_order)
values
  (
    'basic',
    'Basic',
    'For the self-directed athlete who needs a serious space and nothing else.',
    299900,
    30,
    '["Full facility access", "Standard operating hours", "Locker room & showers", "Free-weight & machine floor", "Monthly progress check-in"]'::jsonb,
    true,
    false,
    1
  ),
  (
    'gold',
    'Gold',
    'Guided programming and priority access for members who train with intent.',
    599900,
    30,
    '["Everything in Basic", "Extended hours access", "2 personal training sessions / month", "Custom programming", "Recovery suite access", "Guest privileges (2 / month)"]'::jsonb,
    true,
    true,
    2
  ),
  (
    'elite',
    'Elite',
    'Full access, unlimited coaching, and a studio experience built around you.',
    999900,
    30,
    '["Everything in Gold", "Unlimited personal training", "24/7 facility access", "Private locker assignment", "Quarterly performance review", "Unlimited guest privileges"]'::jsonb,
    true,
    false,
    3
  )
on conflict (slug) do nothing;
