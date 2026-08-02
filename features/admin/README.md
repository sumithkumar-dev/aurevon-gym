# features/admin — reserved for Phase 2

Business logic for the admin dashboard, consumed by the route stub at
`app/(app)/admin/`. Planned sub-areas:

- `dashboard` — studio-wide overview (active members, revenue, churn)
- `members` — member list, search, status management
- `plans` — create/edit membership plans (feeds the public `/membership`
  page and `features/memberships`)
- `payments` — payment/refund history across all members (delegates to
  `features/payments` + `lib/razorpay`)
- `content` — manage trainers, gallery images, and FAQ copy that
  currently live as static data in `lib/site-data.ts` — this is what
  eventually replaces hand-editing that file
- `settings` — studio-level settings (hours, contact info, studio config
  currently in `siteConfig`)
- `roles` — staff/admin role assignment
- `reports` — exportable reports (revenue, attendance, etc.)

As with `features/member`, no empty subfolders are pre-created — each
sub-area gets its folder when it's actually built, since the internal
shape (page + actions + components) will vary per area.
