# lib/auth — reserved for Phase 2

Not implemented yet. This folder holds:

- `session.ts` — read the current user/session in server components
- `guards.ts` — role-based access helpers (member vs admin)

A root-level `middleware.ts` will be added at the same time as this
folder is implemented — not before, since an empty middleware file would
still run on every request for no benefit. It will handle:

- Redirecting unauthenticated users away from `app/(app)/*` routes
- Refreshing the Supabase session cookie (via `lib/supabase/middleware.ts`)
- Role-based redirects (member vs admin)
