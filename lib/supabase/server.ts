import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Always call `auth.getUser()` (not `auth.getSession()`) with this client —
 * `getUser()` revalidates the JWT against Supabase Auth instead of trusting
 * whatever is in the cookie.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Thrown when called from a Server Component during render,
            // where cookies can't be written. Safe to ignore here because
            // `middleware.ts` refreshes the session cookie on every request
            // that actually needs it refreshed (Server Actions and Route
            // Handlers, which run outside render, can write cookies fine).
          }
        },
      },
    }
  );
}
