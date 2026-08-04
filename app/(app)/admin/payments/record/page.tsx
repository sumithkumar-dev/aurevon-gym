import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { getMembers } from "@/lib/supabase/queries/members";
import { getActivePlans } from "@/lib/supabase/queries/plans";
import { RecordPaymentForm } from "@/features/admin/payments/record-payment-form";

export const metadata: Metadata = {
  title: "Record Payment",
};

export default async function RecordPaymentPage() {
  await requireRole(STAFF_ROLES);
  const [members, plans] = await Promise.all([
    getMembers(),
    getActivePlans(),
  ]);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Record Payment
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        For cash or card-terminal payments taken at the front desk. Online
        payments are handled automatically once Razorpay checkout is
        connected.
      </p>

      <div className="mt-10">
        <RecordPaymentForm members={members} plans={plans} />
      </div>
    </div>
  );
}
