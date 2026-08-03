# supabase/migrations

Applied in filename order. Two ways to apply them to a real project:

1. **Supabase CLI** (recommended once the project is linked):
   ```
   supabase link --project-ref <project-ref>
   supabase db push
   ```
2. **SQL Editor**: paste each file's contents into the Supabase Dashboard's
   SQL Editor, in filename order, and run.

## After applying

Regenerate `lib/supabase/database.types.ts` so it matches the live schema:

```
npx supabase gen types typescript --project-id <project-id> --schema public > lib/supabase/database.types.ts
```

## What's here (Phase 2D)

| File | Contents |
|---|---|
| `20260802000001_extensions_and_helpers.sql` | `pgcrypto`, generic `set_updated_at()` trigger |
| `20260802000002_profiles.sql` | `user_role` enum, `profiles` table, `handle_new_user` auth sync, `current_user_role()`, role-change guard, RLS |
| `20260802000003_membership_plans.sql` | Plans table, RLS, seeded with the 3 real plans from `lib/site-data.ts` |
| `20260802000004_memberships.sql` | Status enum, table, one-open-membership-per-member constraint, RLS |
| `20260802000005_payments.sql` | Status/method enums, table, Razorpay idempotency constraints, RLS |
| `20260802000006_invoices.sql` | Table, sequential invoice numbering, RLS |
| `20260802000007_announcements.sql` | Table, publish/draft visibility, RLS |
| `20260802000008_gallery_and_trainers.sql` | Content tables prepared for a future admin content editor, RLS |

Every table has RLS enabled. Every migration in this folder has been applied
and exercised against a local Postgres instance stubbed with Supabase's
`auth` schema — see the Phase 2 summary for the specific checks that were run.
