import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { getMemberProfile } from "@/lib/supabase/queries/members";
import { getCurrentMembership } from "@/lib/supabase/queries/memberships";
import { getPaymentsForMember } from "@/lib/supabase/queries/payments";
import {
  getInvoicesForMember,
  type Invoice,
} from "@/lib/supabase/queries/invoices";
import { MemberDetail } from "@/features/admin/members/member-detail";
import { BackLink } from "@/components/ui/back-link";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Member Detail",
};

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const staff = await requireRole(STAFF_ROLES);
  const { id } = await params;

  const member = await getMemberProfile(id);
  if (!member) {
    notFound();
  }

  const [membership, payments, invoices] = await Promise.all([
    getCurrentMembership(member.id),
    getPaymentsForMember(member.id),
    getInvoicesForMember(member.id),
  ]);

  const invoicesByPaymentId = new Map<string, Invoice>(
    invoices.map((invoice): [string, Invoice] => [invoice.payment_id, invoice])
  );

  return (
    <div className="container-editorial py-16">
      <BackLink href={ROUTES.adminMembers} label="Back to Members" />
      <p className="eyebrow mb-4 mt-6">Admin Dashboard – Members</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        {member.full_name || "Member"}
      </h1>

      <div className="mt-10">
        <MemberDetail
          member={member}
          membership={membership}
          payments={payments}
          invoicesByPaymentId={invoicesByPaymentId}
          viewerRole={staff.role}
        />
      </div>
    </div>
  );
}
