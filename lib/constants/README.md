# lib/constants

Fixed, non-secret values shared across the backend so they're defined once
instead of as magic strings scattered across `features/`, `app/api/`, and
`lib/`.

- `routes.ts` — implemented in Phase 2C. Typed paths for `app/(app)/*`,
  which routes are public vs. staff-only vs. member-only, and
  `roleHomeRoute(role)`. Consumed by `middleware.ts`, `lib/auth/guards.ts`,
  and the login/sign-out actions.

Still planned, added alongside their owning phase (not created now — no
current caller, so no `MembershipStatus`/`PaymentStatus` union until a
feature actually renders one; `lib/supabase/database.types.ts` already
exports the same union types straight from the schema):

- `membership.ts` — status labels for the member/admin UI — Phase 2E/2F
- `payments.ts` — status/method labels and currency formatting — Phase 2G

Role constants live in `lib/permissions/roles.ts`, not here, since roles
are inseparable from the permission checks that consume them.
