import { Section, SectionHeading } from "@/components/ui/section";
import { PricingGrid } from "@/components/ui/pricing-card";
import { membershipPlans } from "@/lib/site-data";

export function MembershipSection() {
  return (
    <Section className="border-t border-border">
      <SectionHeading
        align="center"
        eyebrow="Membership"
        title="Choose your level of access."
        description="Every tier includes full facility access. The difference is how much coaching and recovery support comes with it."
        className="mx-auto"
      />

      <div className="mt-16">
        <PricingGrid plans={membershipPlans} />
      </div>
    </Section>
  );
}
