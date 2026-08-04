import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatDate,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONE,
} from "@/features/memberships/status";
import type { PaymentWithPlan } from "@/lib/supabase/queries/payments";
import type { Invoice } from "@/lib/supabase/queries/invoices";

export function PaymentHistory({
  payments,
  invoicesByPaymentId,
}: {
  payments: PaymentWithPlan[];
  invoicesByPaymentId: Map<string, Invoice>;
}) {
  if (payments.length === 0) {
    return (
      <div className="border border-border bg-surface p-8 md:p-10">
        <p className="text-sm text-muted">
          No payments on file yet. Your payment and invoice history will
          appear here once a payment is made.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-widest2 text-muted">
            <th scope="col" className="px-6 py-4 font-medium">
              Date
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
            <th scope="col" className="px-6 py-4 font-medium">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const invoice = invoicesByPaymentId.get(payment.id);
            return (
              <tr
                key={payment.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-6 py-4 text-foreground">
                  {formatDate(payment.created_at)}
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
                  className={cn("px-6 py-4", PAYMENT_STATUS_TONE[payment.status])}
                >
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </td>
                <td className="px-6 py-4">
                  {invoice ? (
                    invoice.pdf_url ? (
                      <Link
                        href={invoice.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline underline-offset-4 hover:text-accent-bright"
                      >
                        {invoice.invoice_number}
                      </Link>
                    ) : (
                      <span className="text-muted">
                        {invoice.invoice_number}
                      </span>
                    )
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
