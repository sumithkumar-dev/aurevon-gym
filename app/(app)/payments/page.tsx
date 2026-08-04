import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { getCurrentMembership } from "@/lib/supabase/queries/memberships";
import { getPaymentsForMember } from "@/lib/supabase/queries/payments";
import {
  getInvoicesForMember,
  type Invoice,
} from "@/lib/supabase/queries/invoices";
import { getActivePlans } from "@/lib/supabase/queries/plans";
import { PaymentHistory } from "@/features/member/payments/payment-history";
import { PlanPicker } from "@/features/payments/checkout/plan-picker";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ justPaid?: string }>;
}) {
  const profile = await requireRole(["member"]);
  const { justPaid } = await searchParams;

  const [membership, payments, invoices] = await Promise.all([
    getCurrentMembership(profile.id),
    getPaymentsForMember(profile.id),
    getInvoicesForMember(profile.id),
  ]);
  const invoicesByPaymentId = new Map<string, Invoice>(
    invoices.map((invoice): [string, Invoice] => [invoice.payment_id, invoice])
  );

  const needsPlan = !membership || membership.status !== "active";
  const plans = needsPlan ? await getActivePlans() : [];

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Member Portal</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Payments
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Your payment and invoice history.
      </p>

      {justPaid && (
        <div className="mt-8 border border-accent-dim bg-surface p-6">
          <p className="text-sm text-foreground">
            Payment received — your membership will activate within a few
            moments. Refresh this page shortly if it isn&apos;t reflected
            yet below.
          </p>
        </div>
      )}

      {needsPlan && (
        <div className="mt-10">
          <h2 className="font-display text-lg uppercase text-foreground">
            {membership?.status === "pending"
              ? "Complete Your Payment"
              : "Choose a Plan"}
          </h2>
          <div className="mt-4">
            <PlanPicker
              plans={plans}
              memberName={profile.full_name}
              memberEmail={profile.email}
            />
          </div>
        </div>
      )}

      <div className="mt-10">
        <PaymentHistory
          payments={payments}
          invoicesByPaymentId={invoicesByPaymentId}
        />
      </div>
    </div>
  );
}
