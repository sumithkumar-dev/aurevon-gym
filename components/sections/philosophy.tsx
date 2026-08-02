import { Section, SectionHeading } from "@/components/ui/section";

export function Philosophy() {
  return (
    <Section className="border-t border-border">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Our Philosophy"
            title="Discipline is a design problem."
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7 space-y-8">
          <p className="text-xl md:text-2xl leading-snug font-display uppercase text-balance">
            Most gyms are built to be joined. We built ours to be used.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted">
            Aurevon started with a simple complaint: every serious training
            space we&rsquo;d used eventually stopped taking itself seriously.
            Equipment aged. Coaching became generic. The room got louder and
            the standards got quieter.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted">
            So we built the studio we wanted to train in — considered
            programming, a small coaching roster held to a real standard,
            and a room with nothing in it that doesn&rsquo;t earn its place. No
            gimmicks. No noise. Just the work, done properly, for as long
            as you keep showing up.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-muted">
            That&rsquo;s the whole philosophy. Everything else on this page is
            just how we execute it.
          </p>
        </div>
      </div>
    </Section>
  );
}
