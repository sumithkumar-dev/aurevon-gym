import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { getCurrentMembership } from "@/lib/supabase/queries/memberships";
import { MembershipStatusCard } from "@/features/member/dashboard/membership-status-card";
import { QuickLinks } from "@/features/member/dashboard/quick-links";

export const metadata: Metadata = {
  title: "Member Dashboard",
};

export default async function MemberPage() {
  const profile = await requireRole(["member"]);
  const membership = await getCurrentMembership(profile.id);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Member Portal</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Welcome, {profile.full_name || "Member"}
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Your membership status and quick links to your account, all in one
        place.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        <MembershipStatusCard membership={membership} />
        <QuickLinks />
      </div>
    </div>
  );
}
