import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Service-role Supabase client. Bypasses RLS entirely — only for trusted
 * server-only code that has already done its own authorization checks:
 * the Razorpay webhook handler (Phase 2G, verifies the signature first),
 * invoice/email generation (Phase 2G/2H), and admin user creation (Phase 2F,
 * `supabase.auth.admin.createUser` / `inviteUserByEmail`).
 *
 * Never import this from a Client Component or expose
 * `SUPABASE_SERVICE_ROLE_KEY` to the browser — the `server-only` import
 * above makes any such attempt fail the build.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role configuration (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
