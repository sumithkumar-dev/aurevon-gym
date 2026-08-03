# lib/auth

Session and route-guard helpers, implemented in Phase 2C.

- `session.ts` — `getCurrentUser()` / `getCurrentProfile()`, both wrapped in
  React's `cache()` so a request that touches them from both a layout and a
  page only hits Supabase once. Uses `auth.getUser()` (revalidates the JWT),
  never `auth.getSession()`.
- `guards.ts` — `requireUser()` / `requireProfile()` / `requireRole(roles)`,
  called directly from Server Components as a second layer of protection
  behind the root `middleware.ts`.

The root-level `middleware.ts` is the primary defense: it runs before any
Server Component renders, refreshes the Supabase session cookie (via
`lib/supabase/middleware.ts`), and handles redirects for:

- Unauthenticated users hitting a protected `app/(app)/*` route
- Authenticated users hitting `/login`, `/forgot-password`, `/reset-password`
  (redirected to their role's home instead)
- Staff hitting member-only routes, or members hitting staff-only routes
