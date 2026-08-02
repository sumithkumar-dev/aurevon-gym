# lib/supabase — reserved for Phase 2

Not connected yet. When Supabase is introduced, this folder holds:

- `client.ts` — browser client (`createBrowserClient`)
- `server.ts` — server component / route handler client (`createServerClient`)
- `middleware.ts` — session-refresh helper consumed by the root `middleware.ts`
- `database.types.ts` — generated types (`supabase gen types typescript`)
- `queries/` — typed query functions per table/domain, so components never
  call the Supabase client directly

RLS policies are managed in the Supabase dashboard / migrations, not in
this app — no local folder needed for those.
