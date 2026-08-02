import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { PricingGrid } from "@/components/ui/pricing-card";
import { FaqSection } from "@/components/sections/faq-section";
import { Reveal } from "@/components/motion/reveal";
import { membershipPlans } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Membership Plans",
  description:
    "Three membership tiers at Aurevon Studios — Basic, Gold, and Elite. Full facility access at every level.",
});

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Three ways to train here."
        description="Every plan includes full facility access. What changes is how much coaching, recovery, and flexibility comes with it."
      />

      <Section className="pt-0">
        <PricingGrid plans={membershipPlans} />
      </Section>

      <Section className="border-t border-border">
        <Reveal>
          <SectionHeading
            eyebrow="Good To Know"
            title="How membership works."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {[
            {
              title: "No long-term contracts",
              body: "Every plan runs month to month. Cancel with 30 days' notice, no penalty.",
            },
            {
              title: "One-time orientation",
              body: "New members complete a private assessment before their first independent session.",
            },
            {
              title: "Upgrade anytime",
              body: "Move between tiers whenever your training needs change — changes apply from your next billing cycle.",
            },
            {
              title: "Freeze when you travel",
              body: "Every plan includes freeze windows for extended travel or injury, up to two months a year.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 90}>
              <h3 className="font-display text-lg uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <FaqSection />
    </>
  );
}
