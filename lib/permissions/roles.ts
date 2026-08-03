import type { UserRole } from "@/lib/supabase/database.types";

export type Role = UserRole;

export const ROLES: Role[] = ["owner", "manager", "receptionist", "member"];

// Trainer is intentionally not a role here — Trainer authentication is
// deferred past Phase 2, per the roadmap. `public.trainers` (Phase 2D) is
// a content table, not an account.
export const STAFF_ROLES: Role[] = ["owner", "manager", "receptionist"];

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  manager: "Manager",
  receptionist: "Receptionist",
  member: "Member",
};

export function isStaff(role: Role): boolean {
  return STAFF_ROLES.includes(role);
}
