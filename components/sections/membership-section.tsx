import { Section, SectionHeading } from "@/components/ui/section";
import { PricingGrid } from "@/components/ui/pricing-card";
import { Reveal } from "@/components/motion/reveal";
import { getActivePlans } from "@/lib/supabase/queries/plans";
import { toDisplayPlan } from "@/lib/plan-display";

export async function MembershipSection() {
  const plans = await getActivePlans();
  const displayPlans = plans.map(toDisplayPlan);

  return (
    <Section className="border-t border-border">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="Membership"
          title="Choose your level of access."
          description="Every tier includes full facility access. The difference is how much coaching and recovery support comes with it."
          className="mx-auto"
        />
      </Reveal>

      <div className="mt-16">
        {displayPlans.length > 0 ? (
          <PricingGrid plans={displayPlans} />
        ) : (
          <div className="border border-border bg-surface p-8 md:p-10">
            <p className="text-sm text-muted">
              Plans aren&rsquo;t available right now. Please check back soon
              or get in touch.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
