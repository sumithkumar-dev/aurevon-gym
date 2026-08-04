import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { getAllPayments } from "@/lib/supabase/queries/payments";
import { PaymentsTable } from "@/features/admin/payments/payments-table";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function AdminPaymentsPage() {
  await requireRole(STAFF_ROLES);
  const payments = await getAllPayments();

  return (
    <div className="container-editorial py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-4">Admin Dashboard</p>
          <h1 className="font-display text-display-2 uppercase text-foreground">
            Payments
          </h1>
        </div>
        <Button asChild>
          <Link href={`${ROUTES.adminPayments}/record`}>Record Payment</Link>
        </Button>
      </div>

      <div className="mt-10">
        <PaymentsTable payments={payments} />
      </div>
    </div>
  );
}
