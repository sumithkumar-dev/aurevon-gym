# features/admin

Business logic for the admin dashboard, consumed by the route stubs at
`app/(app)/admin/`. Routes stay thin; this folder owns the actual
components, Server Actions, and validation wiring.

Implemented in Phase 2F:

- `dashboard` — `StatCard` + `QuickLinks`, rendered by
  `app/(app)/admin/page.tsx`. Member count, active/pending membership
  counts, and revenue (this month / all-time, captured payments only) —
  no churn/attendance yet, that's `reports` (still not built, see below).
- `members` — `MembersTable` (name/email search via a plain GET form —
  no client JS needed), `MemberStatusForm` + `updateMemberStatusAction`
  (Owner/Manager only, mirrors `profiles_update_own_or_staff` RLS +
  the `prevent_unauthorized_role_change` trigger), and `MemberDetail`.
  `MemberDetail` reuses `features/member/dashboard/membership-status-card`
  and `features/member/payments/payment-history` directly rather than
  rebuilding parallel components — both are pure presentational
  components with no member-portal-specific logic, so they work
  identically for "my own membership" and "a staff member looking at
  someone else's."
- `plans` — `PlanForm` (one component for both create and edit, via
  `.bind()`-parameterized Server Actions, same pattern as
  `updateMemberStatusAction`) + `PlansTable`. Owner/Manager only end to
  end (route guards, actions, and the underlying
  `membership_plans_manage_owner_manager` RLS all agree) — Receptionist
  doesn't get read-only access either, to keep the gating simple (one
  guard per route, not a per-control show/hide). Price is entered in
  rupees and converted to `price_paise` in the action; features are one
  per line in a textarea, converted to the `jsonb` array the column
  expects. No delete — `membership_plans.id` has `on delete restrict`
  from `memberships`, so deactivating (`is_active = false`, via the same
  edit form) is the supported way to retire a plan.
- `payments` — `RecordPaymentForm` + `recordPaymentAction` (the offline
  walk-in/front-desk flow) and `PaymentsTable` (studio-wide history, all
  three staff roles). Recording a payment amount is derived from the
  selected plan's price (no manual amount entry) — kept the MVP scope to
  "pay exactly the plan price," no partial payments or discounts.
  `recordPaymentAction` either activates the member's existing `pending`
  membership (if the plan matches) or creates a new `active` one
  (`memberships_one_open_per_member_idx` allows only one open membership
  per member; renewing a member who's already `active`, or switching
  plans mid-pending, both return a clear error rather than attempting a
  write that RLS/the unique index would reject anyway).

Not implemented — deliberately out of this phase's approved scope
(Overview, Members, Plans, Payments only):

- `content`, `settings`, `roles`, `reports` — unchanged from the original
  plan below.
- Creating a brand-new member account for a walk-in with no prior login
  (`profiles` has no client-insert policy — it's only ever created by the
  `handle_new_user()` trigger via `supabase.auth.admin.createUser()`,
  which needs `lib/supabase/admin.ts`'s service-role client). The offline
  payment flow built here only works for members who already have an
  account; account creation is a separate, larger feature.
- Invoice-row generation for offline payments. `invoices` is designed to
  be generated server-side "alongside a captured/offline-confirmed
  payment" (see `supabase/migrations/20260802000006_invoices.sql`), but
  that migration's own comment reserves the generation logic for Phase
  2G/2H — recording an offline payment in this phase does not also create
  an `invoices` row, so it won't show an invoice number/link on
  `features/member/payments/payment-history.tsx` until that lands.
- Membership renewal/upgrade/downgrade/freeze/cancel — still
  `features/memberships`'s domain, still not built (see that README).

As with the rest of `features/`, no empty subfolders are pre-created for
the not-yet-built areas — each gets its folder when it's actually built.
