import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES, ROLE_LABELS } from "@/lib/permissions/roles";
import { getMemberCount } from "@/lib/supabase/queries/members";
import { getMembershipCounts } from "@/lib/supabase/queries/memberships";
import { getRevenueSummary } from "@/lib/supabase/queries/payments";
import { formatCurrency } from "@/features/memberships/status";
import { StatCard } from "@/features/admin/dashboard/stat-card";
import { QuickLinks } from "@/features/admin/dashboard/quick-links";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const profile = await requireRole(STAFF_ROLES);
  const [memberCount, membershipCounts, revenue] = await Promise.all([
    getMemberCount(),
    getMembershipCounts(),
    getRevenueSummary(),
  ]);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Welcome, {profile.full_name || ROLE_LABELS[profile.role]}
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        A snapshot of the studio, and quick links to members, plans, and
        payments.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={String(memberCount)} />
        <StatCard
          label="Active Memberships"
          value={String(membershipCounts.active)}
          hint={
            membershipCounts.pending > 0
              ? `${membershipCounts.pending} pending payment`
              : undefined
          }
        />
        <StatCard
          label="Revenue This Month"
          value={formatCurrency(revenue.thisMonthPaise)}
        />
        <StatCard
          label="Revenue All Time"
          value={formatCurrency(revenue.allTimePaise)}
        />
      </div>

      <div className="mt-10">
        <QuickLinks />
      </div>
    </div>
  );
}
