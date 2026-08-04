import { CheckoutButton } from "./checkout-button";
import { formatCurrency } from "@/features/memberships/status";
import type { Plan } from "@/lib/supabase/queries/plans";

export function PlanPicker({
  plans,
  memberName,
  memberEmail,
}: {
  plans: Plan[];
  memberName: string;
  memberEmail: string;
}) {
  if (plans.length === 0) {
    return (
      <div className="border border-border bg-surface p-8 md:p-10">
        <p className="text-sm text-muted">
          No plans are available right now. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex flex-col justify-between border border-border bg-surface p-6"
        >
          <div>
            <p className="eyebrow mb-2">{plan.duration_days}-Day Plan</p>
            <h3 className="font-display text-xl uppercase text-foreground">
              {plan.name}
            </h3>
            <p className="mt-2 text-2xl text-foreground">
              {formatCurrency(plan.price_paise)}
            </p>
            {plan.description && (
              <p className="mt-3 text-sm text-muted">{plan.description}</p>
            )}
            {Array.isArray(plan.features) && plan.features.length > 0 && (
              <ul className="mt-4 flex flex-col gap-1 text-sm text-muted">
                {plan.features.map((feature, index) => (
                  <li key={index}>• {String(feature)}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-6">
            <CheckoutButton
              planId={plan.id}
              planName={plan.name}
              memberName={memberName}
              memberEmail={memberEmail}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
