import Link from "next/link";
import { formatCurrency } from "@/features/memberships/status";
import { ROUTES } from "@/lib/constants/routes";
import type { Plan } from "@/lib/supabase/queries/plans";

export function PlansTable({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) {
    return (
      <div className="border border-border bg-surface p-8 md:p-10">
        <p className="text-sm text-muted">No plans yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-widest2 text-muted">
            <th scope="col" className="px-6 py-4 font-medium">
              Name
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Price
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Duration
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Status
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} className="border-b border-border last:border-0">
              <td className="px-6 py-4 text-foreground">
                {plan.name}
                {plan.is_featured && (
                  <span className="ml-2 text-xs uppercase tracking-widest2 text-accent">
                    Featured
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-foreground">
                {formatCurrency(plan.price_paise)}
              </td>
              <td className="px-6 py-4 text-muted">
                {plan.duration_days} days
              </td>
              <td className="px-6 py-4">
                <span
                  className={
                    plan.is_active ? "text-emerald-400" : "text-muted"
                  }
                >
                  {plan.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={`${ROUTES.adminPlans}/${plan.id}/edit`}
                  className="text-accent underline underline-offset-4 hover:text-accent-bright"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
