import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { MembershipWithPlan } from "@/lib/supabase/queries/memberships";
import {
  MEMBERSHIP_STATUS_LABELS,
  MEMBERSHIP_STATUS_TONE,
  formatCurrency,
  formatDate,
} from "@/features/memberships/status";

export function MembershipStatusCard({
  membership,
  showChoosePlanCta = true,
}: {
  membership: MembershipWithPlan | null;
  /** The checkout flow always acts on the *caller's own* session — hide
   * this for the admin "viewing someone else's membership" case, where
   * it would be both unreachable (/payments is member-only) and
   * semantically wrong (it would start checkout for the staff member,
   * not the member being viewed). */
  showChoosePlanCta?: boolean;
}) {
  // No active/pending membership yet — e.g. before a first payment has
  // been made or confirmed. The member portal never creates a membership
  // itself, so this is a normal, expected state, not an error.
  if (!membership || !membership.plan) {
    return (
      <div className="border border-border bg-surface p-8 md:p-10">
        <p className="eyebrow mb-3">Membership</p>
        <h2 className="font-display text-2xl uppercase text-foreground">
          No Membership Yet
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          You don&apos;t have a membership on file yet. Once a payment is
          confirmed – online or at the front desk – it will appear here.
        </p>
        {showChoosePlanCta && (
          <Button asChild variant="outline" className="mt-8">
            <Link href={ROUTES.payments}>Choose a Plan</Link>
          </Button>
        )}
      </div>
    );
  }

  const { plan, status, start_date, end_date, auto_renew } = membership;

  return (
    <div className="border border-border bg-surface p-8 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">Membership</p>
        <span
          className={cn(
            "flex items-center gap-2 text-xs uppercase tracking-widest2",
            MEMBERSHIP_STATUS_TONE[status]
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {MEMBERSHIP_STATUS_LABELS[status]}
        </span>
      </div>

      <h2 className="mt-3 font-display text-3xl uppercase text-foreground">
        {plan.name}
      </h2>

      <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-widest2 text-muted">
            Price
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatCurrency(plan.price_paise)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest2 text-muted">
            Valid From
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatDate(start_date)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest2 text-muted">
            Valid Until
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatDate(end_date)}
          </dd>
        </div>
      </dl>

      {status === "pending" && (
        <p className="mt-6 text-sm text-muted">
          Your membership will activate once payment is confirmed.
        </p>
      )}
      {status === "active" && auto_renew && (
        <p className="mt-6 text-sm text-muted">Auto-renew is on.</p>
      )}
    </div>
  );
}
