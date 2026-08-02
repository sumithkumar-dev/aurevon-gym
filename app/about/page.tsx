import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { Philosophy } from "@/components/sections/philosophy";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "The story behind Aurevon Studios — why we built a training space around standards instead of scale.",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Aurevon"
        title="Built by people who train."
        description="Aurevon wasn't designed by a franchise committee. It was built by coaches and athletes who were tired of choosing between a serious gym and a comfortable one."
      />

      <Philosophy />

      <Section className="border-t border-border">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5" y={24}>
            <Placeholder label="[ Owner Image ]" ratio="portrait" />
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={100}>
            <span className="eyebrow">Founder</span>
            <h2 className="mt-4 font-display text-3xl uppercase">
              Rajiv Malhotra
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              After a decade coaching competitive strength athletes, our
              founder set out to build the studio that had always been
              missing — one where the standard for coaching, equipment, and
              programming never slips, no matter how many members walk
              through the door.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              That standard is the reason membership at Aurevon is
              deliberately limited. We would rather do right by three
              hundred members than do adequately by three thousand.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="What We Believe"
            title="Three things we won't compromise on."
            className="mx-auto"
          />
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            {
              title: "Coaching quality",
              body: "Every coach at Aurevon is hired for judgment, not just certification. Programming is reviewed, not templated.",
            },
            {
              title: "Equipment standards",
              body: "Our floor is inspected weekly. Nothing worn, wobbling, or unsafe stays on the floor past that inspection.",
            },
            {
              title: "Member capacity",
              body: "We cap membership below what the space could technically hold, so the floor never feels like a franchise at 6 p.m.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="border-t border-accent-dim pt-6">
              <h3 className="font-display text-xl uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
