import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth/session";
import type { Role } from "@/lib/permissions/roles";
import { ROUTES, roleHomeRoute } from "@/lib/constants/routes";

/**
 * These mirror the redirect rules in the root `middleware.ts`. Middleware is
 * the primary defense (it runs before any Server Component renders); these
 * guards are the second layer, called directly from a page/layout so a
 * route is never one matcher-config typo away from being unprotected.
 */

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.login);
  }
  return user;
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(ROUTES.login);
  }
  return profile;
}

export async function requireRole(allowed: Role[]) {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) {
    redirect(roleHomeRoute(profile.role));
  }
  return profile;
}
