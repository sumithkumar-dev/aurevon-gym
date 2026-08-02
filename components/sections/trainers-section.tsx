import { Section, SectionHeading } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "@/components/motion/reveal";
import { trainers } from "@/lib/site-data";

export function TrainersSection() {
  return (
    <Section className="border-t border-border">
      <Reveal>
        <SectionHeading
          eyebrow="The Coaching Staff"
          title="Coached, not just supervised."
          description="A small, deliberately limited roster. Every coach at Aurevon carries a caseload they can actually manage."
        />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {trainers.map((trainer, i) => (
          <Reveal key={trainer.id} delay={(i % 4) * 70}>
            <Placeholder label="[ Trainer Image ]" ratio="portrait" />
            <h3 className="mt-5 font-display text-2xl uppercase tracking-wide">
              {trainer.name}
            </h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-accent">
              {trainer.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {trainer.bio}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
