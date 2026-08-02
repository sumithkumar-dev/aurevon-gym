# features/member — reserved for Phase 2

Business logic for the member portal, consumed by the route stubs at
`app/(app)/member/`, `app/(app)/profile/`, and `app/(app)/settings/`.
Planned sub-areas:

- `dashboard` — membership status, quick links, upcoming sessions
- `membership` — current plan detail, upgrade/freeze/cancel entry points
  (delegates the actual logic to `features/memberships`)
- `invoices` — past invoice list/download (delegates to
  `features/payments`)
- `profile` — name, contact info, training goals
- `notifications` — email/SMS preference toggles

Each sub-area is small enough that a single `page.tsx` + a couple of
co-located components will likely be enough — no need to pre-create
empty subfolders for these until the first one is actually built.
