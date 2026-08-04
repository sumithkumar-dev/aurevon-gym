import type { Role } from "./roles";

/**
 * "Is this role allowed to do X" for actions that need a gate finer than
 * "any staff member" but coarser than a full ACL. This is the UI-side
 * mirror of two RLS policies — `profiles_update_own_or_staff` (role/status
 * changes are Owner/Manager only, enforced again by the
 * `prevent_unauthorized_role_change` trigger) and
 * `membership_plans_manage_owner_manager` — used to hide/show the
 * corresponding controls. RLS is what actually enforces it; this just
 * keeps the UI from showing a button that would fail server-side.
 */
const PERMISSIONS = {
  "members:changeStatus": ["owner", "manager"],
  "plans:manage": ["owner", "manager"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}
