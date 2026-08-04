import { MembershipStatusCard } from "@/features/member/dashboard/membership-status-card";
import { PaymentHistory } from "@/features/member/payments/payment-history";
import { MemberStatusForm } from "./member-status-form";
import { formatDate } from "@/features/memberships/status";
import { can } from "@/lib/permissions/can";
import type { Role } from "@/lib/permissions/roles";
import type { MemberProfile } from "@/lib/supabase/queries/members";
import type { MembershipWithPlan } from "@/lib/supabase/queries/memberships";
import type { PaymentWithPlan } from "@/lib/supabase/queries/payments";
import type { Invoice } from "@/lib/supabase/queries/invoices";

export function MemberDetail({
  member,
  membership,
  payments,
  invoicesByPaymentId,
  viewerRole,
}: {
  member: MemberProfile;
  membership: MembershipWithPlan | null;
  payments: PaymentWithPlan[];
  invoicesByPaymentId: Map<string, Invoice>;
  viewerRole: Role;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div className="border border-border bg-surface p-8 md:p-10">
        <p className="eyebrow mb-3">Member</p>
        <h2 className="font-display text-2xl uppercase text-foreground">
          {member.full_name || "—"}
        </h2>

        <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-muted">
              Email
            </dt>
            <dd className="mt-1 text-sm text-foreground">{member.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-muted">
              Phone
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {member.phone || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-muted">
              Member Since
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatDate(member.created_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest2 text-muted">
              Account Status
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {member.status === "active" ? "Active" : "Inactive"}
            </dd>
          </div>
        </dl>

        {can(viewerRole, "members:changeStatus") && (
          <div className="mt-8 border-t border-border pt-8">
            <MemberStatusForm memberId={member.id} status={member.status} />
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg uppercase text-foreground">
          Membership
        </h3>
        <div className="mt-4">
          <MembershipStatusCard
            membership={membership}
            showChoosePlanCta={false}
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg uppercase text-foreground">
          Payment History
        </h3>
        <div className="mt-4">
          <PaymentHistory
            payments={payments}
            invoicesByPaymentId={invoicesByPaymentId}
          />
        </div>
      </div>
    </div>
  );
}
