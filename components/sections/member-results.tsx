import { Section, SectionHeading } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { testimonials } from "@/lib/site-data";

export function MemberResults() {
  return (
    <Section className="border-t border-border" bleed>
      <div className="container-editorial">
        <SectionHeading
          eyebrow="Member Results"
          title="The proof is in the progression."
          description="Every member's programming is logged and reviewed. These are a few of the people who've stayed the course."
        />
      </div>

      <div className="container-editorial mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={t.id}
            className={i === 1 ? "lg:mt-12" : undefined}
          >
            <Placeholder label="[ Member Transformation ]" ratio="portrait" />
            <blockquote className="mt-6 text-lg leading-snug text-balance">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-wide text-muted">
              {t.name} <span className="text-accent">— {t.detail}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
