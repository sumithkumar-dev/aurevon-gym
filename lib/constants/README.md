# lib/constants

Fixed, non-secret values shared across the backend so they're defined once
instead of as magic strings scattered across `features/`, `app/api/`, and
`lib/`.

- `routes.ts` — implemented in Phase 2C. Typed paths for `app/(app)/*`,
  which routes are public vs. staff-only vs. member-only, and
  `roleHomeRoute(role)`. Consumed by `middleware.ts`, `lib/auth/guards.ts`,
  and the login/sign-out actions. Extended (additively — no existing key
  changed) in Phase 2E (`profile`, `settings`, `payments`) and Phase 2F
  (`adminMembers`, `adminPlans`, `adminPayments`); `STAFF_ONLY_PREFIXES`
  needed no changes since it already prefix-matches every `/admin/*`
  sub-route.

Status/formatting labels ended up in `features/memberships/status.ts`
instead of here (Phase 2E, extended in 2F for payment status/method):
domain logic that's reused by both the member portal and the admin
dashboard fits that folder's stated charter better than a flat constants
file, and `database.types.ts` already supplies the union types this file
would otherwise need to redeclare.

Correction to an earlier note: a `payments.ts` here for Razorpay-specific
constants (webhook event names, order options) was planned for Phase 2G,
but wasn't needed — `lib/razorpay/webhooks.ts` only checks two event name
strings (`"payment.captured"`, `"payment.failed"`), and a constants file
for two literals used in one place would be the kind of abstraction with
no real caller this project has consistently avoided elsewhere (see
`lib/permissions/README.md` on `can.ts`, or `features/admin/README.md`
on not pre-creating empty feature folders).

Role constants live in `lib/permissions/roles.ts`, not here, since roles
are inseparable from the permission checks that consume them.
