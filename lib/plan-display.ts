import type { Plan } from "@/lib/supabase/queries/plans";
import type { MembershipPlan } from "@/types/site";
import { formatCurrency } from "@/features/memberships/status";

/** Friendly label for a plan's billing cadence from its raw day count.
 * Falls back to an exact day count for anything that isn't a common,
 * recognizable cadence — the schema only stores `duration_days`, so this
 * stays accurate for whatever an owner configures. */
function periodLabel(durationDays: number): string {
  if (durationDays >= 28 && durationDays <= 31) return "/month";
  if (durationDays >= 84 && durationDays <= 95) return "/quarter";
  if (durationDays >= 175 && durationDays <= 190) return "/6 months";
  if (durationDays >= 350 && durationDays <= 380) return "/year";
  return `/${durationDays} days`;
}

/** Converts a DB `membership_plans` row into the shape the marketing
 * pricing components expect, so the public pricing pages always reflect
 * what's actually configured in the admin Plans dashboard. */
export function toDisplayPlan(plan: Plan): MembershipPlan {
  return {
    id: plan.slug,
    name: plan.name,
    price: formatCurrency(plan.price_paise),
    period: periodLabel(plan.duration_days),
    description: plan.description,
    features: Array.isArray(plan.features)
      ? plan.features.map((feature) => String(feature))
      : [],
    featured: plan.is_featured,
  };
}
