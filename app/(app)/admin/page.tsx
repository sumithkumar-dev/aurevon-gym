import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES, ROLE_LABELS } from "@/lib/permissions/roles";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const profile = await requireRole(STAFF_ROLES);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Welcome, {profile.full_name || ROLE_LABELS[profile.role]}
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Members, plans, payments, announcements, website content, settings,
        roles, and reports land here in Phase 2F. This page confirms
        staff-only routing is correctly enforced for the{" "}
        {ROLE_LABELS[profile.role]} role.
      </p>
    </div>
  );
}
