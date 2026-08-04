import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/supabase/queries/profiles";

/**
 * The current authenticated user, or null. Uses `auth.getUser()`, which
 * revalidates the JWT against Supabase Auth — safe to use for authorization
 * decisions, unlike `auth.getSession()`.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** The current user's profile row (role, name, etc.), or null if signed out. */
export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return getProfileById(user.id);
});
