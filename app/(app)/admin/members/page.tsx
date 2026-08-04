import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { getMembers } from "@/lib/supabase/queries/members";
import { MembersTable } from "@/features/admin/members/members-table";

export const metadata: Metadata = {
  title: "Members",
};

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { search } = await searchParams;
  const members = await getMembers(search);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Members
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Search members and open a profile to view their membership and
        payment history.
      </p>

      <div className="mt-10">
        <MembersTable members={members} search={search} />
      </div>
    </div>
  );
}
