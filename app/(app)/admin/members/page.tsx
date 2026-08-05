import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { getMembers } from "@/lib/supabase/queries/members";
import { MembersTable } from "@/features/admin/members/members-table";
import { ADMIN_PAGE_SIZE, parsePageParam } from "@/lib/constants/pagination";

export const metadata: Metadata = {
  title: "Members",
};

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { search, page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);
  const { members, totalCount } = await getMembers(search, page);
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Members
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Search members and open a profile to view membership status, payment
        history, and account status.
      </p>

      <div className="mt-10">
        <MembersTable
          members={members}
          search={search}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
