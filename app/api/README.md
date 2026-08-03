# app/api

Route handlers only — no business logic lives here directly; each route
validates input, checks permissions, then calls into the matching
`features/<domain>/` or `lib/<domain>/` helper and stays thin.

- `auth/callback/` — implemented in Phase 2C. Exchanges the `code` param
  from a Supabase Auth email link (password reset, future invite emails)
  for a session, then redirects to `next`.

Planned, added alongside their owning phase:

- `razorpay/checkout/` — order creation — Phase 2G
- `razorpay/webhook/` — signature-verified payment event handling (the
  source of truth for membership activation, not the client redirect) —
  Phase 2G
- `members/` — admin-only member CRUD backing `features/admin/members` —
  Phase 2F

Every route validates its input against a schema in `lib/validations/` and
checks the caller's role via `lib/permissions/`/`lib/auth/guards.ts` before
touching the database. No route trusts client input directly.
