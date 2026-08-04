import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { trainers } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Trainers",
  description: "Meet the coaching staff at Aurevon Studios.",
});

export default function TrainersPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Coaching Staff"
        title="A small roster, on purpose."
        description="We limit our coaching staff so every coach can carry a caseload they actually know — every member, every session, every number."
      />

      <Section className="pt-0">
        <div className="space-y-24">
          {trainers.map((trainer, i) => (
            <div
              key={trainer.id}
              className="grid grid-cols-1 gap-10 border-t border-border pt-12 lg:grid-cols-12 lg:items-center"
            >
              <Reveal
                className={i % 2 === 1 ? "lg:col-span-4 lg:col-start-9 lg:order-2" : "lg:col-span-4"}
                y={24}
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-border">
                  <Image
                    src={trainer.image.src}
                    alt={trainer.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal
                className={i % 2 === 1 ? "lg:col-span-7 lg:order-1" : "lg:col-span-7 lg:col-start-6"}
                delay={100}
              >
                <span className="eyebrow">{`0${i + 1}`}</span>
                <h2 className="mt-4 font-display text-3xl md:text-4xl uppercase">
                  {trainer.name}
                </h2>
                <p className="mt-2 text-sm uppercase tracking-wide text-accent">
                  {trainer.title}
                </p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
                  {trainer.bio}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border text-center">
        <Reveal>
          <h2 className="font-display text-display-2 uppercase text-balance max-w-2xl mx-auto">
            Ready to train with a real coach?
          </h2>
          <div className="mt-8 flex justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/join">Join Now</Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
