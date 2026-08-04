# features/member

Business logic for the member portal, consumed by the route stubs at
`app/(app)/member/`, `app/(app)/profile/`, `app/(app)/payments/`, and
`app/(app)/settings/`. Routes stay thin; this folder owns the actual
components, Server Actions, and validation wiring.

Implemented in Phase 2E:

- `dashboard` — `MembershipStatusCard` (current membership + plan, or an
  explicit "no membership yet" state — see `features/memberships/README.md`
  for why that state is normal) and `QuickLinks`, both rendered by
  `app/(app)/member/page.tsx`.
- `profile` — `ProfileForm` + `updateProfileAction`. Edits the caller's own
  `profiles` row (name, phone, DOB, gender, address, emergency contact).
  Email, role, and status are intentionally not editable here — role/status
  changes are blocked at the database level for non-staff
  (`prevent_unauthorized_role_change()`, Phase 2D) and email changes need a
  separate verification flow that's out of scope for this phase.
- `payments` — `PaymentHistory`, a read-only table joining
  `lib/supabase/queries/payments.ts` and `queries/invoices.ts` by
  `payment_id`. Named to match the `/payments` route directly (the
  sub-area was originally sketched as `invoices` below; renamed for 1:1
  route traceability since it covers both tables).
- `settings` — `ChangePasswordForm` + `changePasswordAction`. Re-verifies
  the current password via `signInWithPassword` before calling
  `auth.updateUser()` — unlike the Phase 2C reset-password flow (which
  starts from a fresh recovery link), this starts from an ordinary
  session, so it can't assume the person at the keyboard is the account
  owner without asking.

No `notifications` sub-area: not part of this phase's scope (no
notification-preference table exists yet), so it wasn't built as a
placeholder. Add it in a later phase alongside the schema it needs.

`membership` (current plan detail, upgrade/freeze/cancel entry points)
remains **not** implemented here — that's `features/memberships`'s domain
logic, consumed by this portal's dashboard but not owned by it.
