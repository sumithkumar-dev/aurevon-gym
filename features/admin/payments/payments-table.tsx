import {
  formatCurrency,
  formatDate,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONE,
} from "@/features/memberships/status";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { ROUTES } from "@/lib/constants/routes";
import type { PaymentWithMemberAndPlan } from "@/lib/supabase/queries/payments";

export function PaymentsTable({
  payments,
  currentPage,
  totalPages,
}: {
  payments: PaymentWithMemberAndPlan[];
  currentPage: number;
  totalPages: number;
}) {
  if (payments.length === 0) {
    return (
      <div className="border border-border bg-surface p-8 md:p-10">
        <p className="text-sm text-muted">No payments recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest2 text-muted">
              <th scope="col" className="px-6 py-4 font-medium">
                Date
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Member
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Plan
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Amount
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Method
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-6 py-4 text-foreground">
                  {formatDate(payment.created_at)}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {payment.member?.full_name || payment.member?.email || "—"}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {payment.plan?.name ?? "—"}
                </td>
                <td className="px-6 py-4 text-foreground">
                  {formatCurrency(payment.amount_paise)}
                </td>
                <td className="px-6 py-4 text-muted">
                  {PAYMENT_METHOD_LABELS[payment.method]}
                </td>
                <td
                  className={cn(
                    "px-6 py-4",
                    PAYMENT_STATUS_TONE[payment.status],
                  )}
                >
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath={ROUTES.adminPayments}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
