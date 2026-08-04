# lib/permissions

Answers "is this logged-in user allowed to do X" — distinct from
`lib/auth/guards.ts`, which answers "is this user logged in at all / where
should they be redirected."

- `roles.ts` — implemented in Phase 2C. The four platform roles (Owner,
  Manager, Receptionist, Member), `STAFF_ROLES`, and `ROLE_LABELS`.

Trainer is intentionally not a role here — Trainer authentication is
deferred past Phase 2, per the roadmap. `public.trainers` (Phase 2D) is a
content table, not an account.

`can.ts` — typed permission checks (e.g. `can(role, "members:create")`) —
is deliberately not created yet. Phase 2C only needs route-level role
gating, which `roles.ts` + `lib/auth/guards.ts` + `middleware.ts` already
cover; a permissions map with no caller would be dead code. It lands in
Phase 2F alongside the first UI that needs to hide/show an action by role
(e.g. only Owner/Manager seeing a "change role" control).

Implemented in Phase 2F: `can.ts` now exists, with two permissions —
`members:changeStatus` and `plans:manage`, both Owner/Manager only. It's
the UI-side mirror of `profiles_update_own_or_staff` and
`membership_plans_manage_owner_manager` RLS (used to hide/show the
corresponding controls in `features/admin/members` and
`features/admin/plans`) — `requireRole()` in the actual Server Actions is
still what enforces it, same as RLS does at the database.
