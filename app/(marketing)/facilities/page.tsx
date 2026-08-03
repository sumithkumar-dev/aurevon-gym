import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { TheSpace } from "@/components/sections/the-space";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = pageMetadata({
  title: "Facilities",
  description: "Inside Aurevon Studios — the free-weight floor, conditioning bay, and recovery suite.",
});

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Facilities"
        title="Twelve thousand square feet, no wasted space."
        description="Three floors, each built for a single purpose: strength, conditioning, and recovery — kept separate so each one works properly."
      />

      <TheSpace />

      <Section className="border-t border-border">
        <Reveal>
          <SectionHeading
            eyebrow="Equipment"
            title="What's on the floor."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Competition powerlifting platforms",
            "Full Olympic weightlifting setup",
            "Specialty bars — safety squat, trap, cambered",
            "Selectorized machine range",
            "Dedicated conditioning equipment",
            "Cold plunge & sauna recovery suite",
          ].map((item, i) => (
            <Reveal key={item} delay={(i % 3) * 80} className="border-t border-accent-dim pt-4">
              <p className="text-sm text-foreground/90">{item}</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
