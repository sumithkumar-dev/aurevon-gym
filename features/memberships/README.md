# features/memberships

Business logic for membership plans and a member's active plan/status —
distinct from `features/member`, which covers the member's own portal UI.
This folder owns the domain logic shared by both the member portal and
the (future) admin dashboard:

- Plan data (eventually sourced from Supabase instead of
  `lib/site-data.ts`)
- Status types (active, frozen, cancelled) shared across member + admin

Implemented in Phase 2E:

- `status.ts` — `MEMBERSHIP_STATUS_LABELS` / `MEMBERSHIP_STATUS_TONE` (a
  `MembershipStatus` -> display label / Tailwind text-color map) and
  `formatCurrency()` / `formatDate()` (paise -> `₹` and ISO date/timestamp
  -> localized display string). Used by
  `features/member/dashboard/membership-status-card.tsx` and
  `features/member/payments/payment-history.tsx`; intended to be reused
  by the Phase 2F admin dashboard rather than re-implemented there.

Extended in Phase 2F:

- `status.ts` — added `PAYMENT_STATUS_LABELS` / `PAYMENT_STATUS_TONE` /
  `PAYMENT_METHOD_LABELS`, moved here from
  `features/member/payments/payment-history.tsx` (which defined them
  locally in Phase 2E) once `features/admin/payments/payments-table.tsx`
  needed the same maps — same reasoning as the membership status maps
  above, just for payments instead. `features/admin/members` also reuses
  `membership-status-card.tsx`/`payment-history.tsx` themselves wholesale
  (not just their formatting helpers) for the "staff viewing one member's
  detail" case — the Phase 2E prediction above held.

Still planned, added alongside their owning phase:

- Upgrade / downgrade / freeze / cancel logic (Phase 2G+ — the member
  portal built in Phase 2E, and the admin member/payment tools built in
  Phase 2F, are read/manage-existing only; memberships are only created
  by a verified payment or a staff walk-in, never changed in place beyond
  the pending->active transition both of those phases handle)

`components/ui/pricing-card.tsx` and `lib/site-data.ts` remain the
Phase 1 source of truth for the public-facing plan display until this
is connected.
