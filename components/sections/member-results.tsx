import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
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
            {/* These are before/after split-panel composites, not single
                shots — a 3:4 portrait crop was cutting each one down to a
                strip that mixed the left panel with the right panel
                instead of showing either side-by-side comparison intact.
                16:9 matches the source and keeps both halves whole. */}
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border">
              <Image
                src={t.image.src}
                alt={t.image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 90vw"
                className="object-cover"
              />
            </div>
            <blockquote className="mt-6 text-lg leading-snug text-balance">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-wide text-muted">
              {t.name} <span className="text-accent">– {t.detail}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
