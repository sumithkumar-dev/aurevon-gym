# /login — reserved for Phase 2

This route is intentionally unimplemented in Phase 1 (public website only).
Placed inside the `(app)` route group so member/admin/auth features can be
added later without restructuring the public site's routes or layouts.

Business logic will live in `features/auth/` — this route stays a thin
entry point that renders components from there.
