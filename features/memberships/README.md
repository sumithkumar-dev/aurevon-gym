# features/memberships — reserved for Phase 2

Business logic for membership plans and a member's active plan/status —
distinct from `features/member`, which covers the member's own portal UI.
This folder owns the domain logic shared by both the member portal and
the admin dashboard:

- Plan data (eventually sourced from Supabase instead of
  `lib/site-data.ts`)
- Upgrade / downgrade / freeze / cancel logic
- Status types (active, frozen, cancelled) shared across member + admin

`components/ui/pricing-card.tsx` and `lib/site-data.ts` remain the
Phase 1 source of truth for the public-facing plan display until this
is connected.
