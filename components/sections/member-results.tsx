import { Section, SectionHeading } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "@/components/motion/reveal";
import { testimonials } from "@/lib/site-data";

export function MemberResults() {
  return (
    <Section className="border-t border-border" bleed>
      <div className="container-editorial">
        <Reveal>
          <SectionHeading
            eyebrow="Member Results"
            title="The proof is in the progression."
            description="Every member's programming is logged and reviewed. These are a few of the people who've stayed the course."
          />
        </Reveal>
      </div>

      <div className="container-editorial mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.id}
            as="figure"
            delay={i * 90}
            className={i === 1 ? "lg:mt-12" : undefined}
          >
            <Placeholder label="[ Member Transformation ]" ratio="portrait" />
            <blockquote className="mt-6 text-lg leading-snug text-balance">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-wide text-muted">
              {t.name} <span className="text-accent">— {t.detail}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
