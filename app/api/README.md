# app/api

Route handlers only — no business logic lives here directly; each route
validates input, checks permissions, then calls into the matching
`features/<domain>/` or `lib/<domain>/` helper and stays thin.

- `auth/callback/` — implemented in Phase 2C. Exchanges the `code` param
  from a Supabase Auth email link (password reset, future invite emails)
  for a session, then redirects to `next`.
- `razorpay/checkout/` — implemented in Phase 2G. Order creation. Not
  covered by `middleware.ts` (its matcher only lists page paths), so this
  route authenticates itself — deliberately via `getCurrentProfile()` +
  a manual 401/403, not `lib/auth/guards.ts`'s `requireRole()`, which
  redirects on failure and would break a `fetch()`-based JSON client.
- `razorpay/webhook/` — implemented in Phase 2G. Signature-verified
  payment event handling — the source of truth for membership
  activation, not the client redirect. No Supabase session exists for
  this route (Razorpay calls it server-to-server); the
  `x-razorpay-signature` header check against the raw body *is* its
  entire authentication story.

Correction to an earlier note: `members/` (admin-only member CRUD) was
planned here for Phase 2F, but shipped instead as Server Actions in
`features/admin/members/actions.ts`, consistent with how every other
admin/member mutation in this app works (a Server Component page +
`useActionState` form, not a REST endpoint) — a dedicated API route
would have been a second, redundant way to do the same writes.

Every route validates its input against a schema in `lib/validations/` and
checks the caller's role via `lib/permissions/`/`lib/auth/guards.ts` before
touching the database. No route trusts client input directly.
