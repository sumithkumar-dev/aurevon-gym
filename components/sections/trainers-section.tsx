import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { trainers } from "@/lib/site-data";

export function TrainersSection() {
  return (
    <Section className="border-t border-border">
      <Reveal>
        <SectionHeading
          eyebrow="The Coaching Staff"
          title="Coached, not just supervised."
          description="Two coaches, deliberately. Every member at Aurevon is known by name, and every caseload stays one a coach can actually manage."
        />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-14 sm:grid-cols-2 sm:max-w-2xl sm:mx-auto">
        {trainers.map((trainer, i) => (
          <Reveal key={trainer.id} delay={i * 90}>
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-border">
              <Image
                src={trainer.image.src}
                alt={trainer.image.alt}
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
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
