import { CheckoutButton } from "./checkout-button";
import { formatCurrency } from "@/features/memberships/status";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/supabase/queries/plans";

export function PlanPicker({
  plans,
  memberName,
  memberEmail,
  highlightSlug,
}: {
  plans: Plan[];
  memberName: string;
  memberEmail: string;
  /** Slug of the plan the member already picked before signing up (from
   * /join's `?plan=`), so they land here on a plan that's already called
   * out instead of having to remember which one they chose. */
  highlightSlug?: string;
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
      {plans.map((plan) => {
        const isHighlighted = Boolean(
          highlightSlug && plan.slug === highlightSlug
        );
        return (
        <div
          key={plan.id}
          className={cn(
            "flex flex-col justify-between border p-6",
            isHighlighted
              ? "border-accent bg-surface-raised"
              : "border-border bg-surface"
          )}
        >
          <div>
            {isHighlighted && (
              <p className="eyebrow mb-2 text-accent">Your Selected Plan</p>
            )}
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
        );
      })}
    </div>
  );
}
