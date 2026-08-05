# /admin

Staff-facing dashboard (owner/manager/receptionist — gated by
`requireRole()` on every page, mirrored by `middleware.ts` and RLS).
Placed inside the `(app)` route group so it shares auth/session plumbing
with the member portal and auth routes without affecting the public
site's routes or layouts.

Routes:

- `/admin` — overview (member count, membership counts, revenue)
- `/admin/members`, `/admin/members/[id]` — search members, view a
  member's membership + payment history, change account status
  (owner/manager only)
- `/admin/plans`, `/admin/plans/new`, `/admin/plans/[id]/edit` —
  manage membership plans (owner/manager only)
- `/admin/payments`, `/admin/payments/record` — payment history,
  record an offline (front-desk) payment

Business logic lives in `features/admin/` — each route here stays a thin
entry point that fetches data via `lib/supabase/queries/` and renders
components from there.
