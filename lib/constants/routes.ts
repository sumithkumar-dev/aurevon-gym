import type { Role } from "@/lib/permissions/roles";

export const ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  member: "/member",
  admin: "/admin",
  adminMembers: "/admin/members",
  adminPlans: "/admin/plans",
  adminPayments: "/admin/payments",
  profile: "/profile",
  settings: "/settings",
  payments: "/payments",
} as const;

// Routes inside the `(app)` group that don't require a session — the
// remaining `(app)` routes are protected by default (see middleware.ts).
export const PUBLIC_APP_ROUTES: string[] = [
  ROUTES.login,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
];

export const STAFF_ONLY_PREFIXES: string[] = [ROUTES.admin];

export const MEMBER_ONLY_PREFIXES: string[] = [
  ROUTES.member,
  ROUTES.profile,
  ROUTES.settings,
  ROUTES.payments,
];

export function roleHomeRoute(role: Role): string {
  return role === "member" ? ROUTES.member : ROUTES.admin;
}
