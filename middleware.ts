import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { STAFF_ROLES, type Role } from "@/lib/permissions/roles";
import {
  PUBLIC_APP_ROUTES,
  STAFF_ONLY_PREFIXES,
  MEMBER_ONLY_PREFIXES,
  ROUTES,
  roleHomeRoute,
} from "@/lib/constants/routes";

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createMiddlewareClient(request);

  // Revalidates the JWT against Supabase Auth (not just reading the
  // cookie) and, as a side effect, refreshes it if it's close to expiring.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicAppRoute = PUBLIC_APP_ROUTES.includes(pathname);

  if (!user) {
    if (isPublicAppRoute) {
      return response;
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROUTES.login;
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Signed in: look up the role once and reuse it for every redirect
  // decision below. RLS still applies to this query (the middleware client
  // carries the user's own session, not the service role).
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role: Role = profile?.role ?? "member";

  if (isPublicAppRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHomeRoute(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (startsWithAny(pathname, STAFF_ONLY_PREFIXES) && !STAFF_ROLES.includes(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHomeRoute(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (startsWithAny(pathname, MEMBER_ONLY_PREFIXES) && STAFF_ROLES.includes(role)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHomeRoute(role);
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/member/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/payments/:path*",
  ],
};
