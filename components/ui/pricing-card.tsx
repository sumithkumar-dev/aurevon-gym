import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import type { MembershipPlan } from "@/types/site";

export function PricingGrid({ plans }: { plans: MembershipPlan[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
      {plans.map((plan, i) => (
        <Reveal key={plan.id} delay={i * 80}>
          <PricingCard plan={plan} />
        </Reveal>
      ))}
    </div>
  );
}

export function PricingCard({ plan }: { plan: MembershipPlan }) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col border p-8 transition-all duration-300 ease-editorial md:p-10 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_hsl(var(--background)/0.8)]",
        plan.featured
          ? "border-accent bg-surface-raised hover:border-accent-bright"
          : "border-border bg-surface hover:border-accent-dim"
      )}
    >
      {plan.featured && (
        <span className="eyebrow absolute -top-3 left-8 bg-background px-3">
          Most Chosen
        </span>
      )}

      <h3 className="font-display text-3xl uppercase tracking-wide">
        {plan.name}
      </h3>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-5xl">{plan.price}</span>
        <span className="text-muted text-sm">{plan.period}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        {plan.description}
      </p>

      <div className="my-8 h-px w-full bg-border" />

      <ul className="flex-1 space-y-4">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="text-foreground/90">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.featured ? "primary" : "outline"}
        className="mt-10 w-full"
        aria-label={`Join the ${plan.name} membership plan`}
      >
        Join Now
      </Button>
    </div>
  );
}
