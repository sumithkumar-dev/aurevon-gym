import Image from "next/image";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { spaceImages } from "@/lib/site-images";

function SpaceImage({
  image,
  ratio,
}: {
  image: { src: string; alt: string };
  ratio: "wide" | "portrait";
}) {
  return (
    <div
      className={
        "relative w-full overflow-hidden border border-border " +
        (ratio === "wide" ? "aspect-[16/9]" : "aspect-[3/4]")
      }
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={ratio === "wide" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 40vw, 90vw"}
        className="object-cover"
      />
    </div>
  );
}

export function TheSpace() {
  return (
    <Section className="border-t border-border" bleed>
      <div className="container-editorial">
        <Reveal>
          <SectionHeading
            eyebrow="The Space"
            title="Built for the work, not the photos."
            description="Twelve thousand square feet across three floors — a free-weight floor, a conditioning bay, and a private recovery suite. Every corner was chosen for function first."
          />
        </Reveal>
      </div>

      {/* Row 1: large image left, supporting text right */}
      <div className="container-editorial mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-8" y={24}>
          <SpaceImage image={spaceImages.mainFloor} ratio="wide" />
        </Reveal>
        <Reveal className="lg:col-span-4" delay={100}>
          <span className="eyebrow">01 — Main Floor</span>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Competition platforms, a full free-weight range, and unobstructed
            sightlines from every corner of the room.
          </p>
        </Reveal>
      </div>

      {/* Row 2: asymmetrical, two smaller images offset */}
      <div className="container-editorial mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5" y={24}>
          <SpaceImage image={spaceImages.freeWeights} ratio="portrait" />
          <div className="mt-4">
            <span className="eyebrow">02 — Free Weights</span>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Commercial-grade racks, plates, and specialty bars, maintained
              and inspected weekly.
            </p>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8 lg:mt-24" delay={120} y={24}>
          <SpaceImage image={spaceImages.detailedEquipment} ratio="portrait" />
          <div className="mt-4">
            <span className="eyebrow">03 — Equipment Detail</span>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Every plate, bar, and attachment chosen for durability under
              serious daily load.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Row 3: full-bleed wide, text overlay style */}
      <div className="container-editorial mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow">04 — Entrance</span>
            <p className="mt-4 text-base leading-relaxed text-muted">
              A private entrance that sets the tone before a single rep is
              taken — considered, quiet, and unmistakably serious.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100} y={24}>
            <SpaceImage image={spaceImages.gymEntrance} ratio="wide" />
          </Reveal>
        </div>
      </div>

      {/* Row 4: asymmetrical, two smaller images offset */}
      <div className="container-editorial mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5" y={24}>
          <SpaceImage image={spaceImages.conditioningBay} ratio="portrait" />
          <div className="mt-4">
            <span className="eyebrow">05 — Conditioning</span>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A dedicated bay for engine work, kept separate from the
              strength floor so both can be used properly.
            </p>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8 lg:mt-24" delay={120} y={24}>
          <SpaceImage image={spaceImages.memberTraining} ratio="portrait" />
          <div className="mt-4">
            <span className="eyebrow">06 — Training Floor</span>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Members training with intent, supported by unobstructed floor
              space at every hour.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Row 5: full-bleed wide, text overlay style */}
      <div className="container-editorial mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow">07 — Coaching</span>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Every session is coached, not just supervised — technique
              correction and load progression, tracked over time.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100} y={24}>
            <SpaceImage image={spaceImages.coachingSession} ratio="wide" />
          </Reveal>
        </div>
      </div>

      {/* Row 6: full-bleed wide, text overlay style */}
      <div className="container-editorial mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow">08 — Recovery Suite</span>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Cold plunge, sauna, and mobility bay — reserved for Gold and
              Elite members, available every day the studio is open.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={100} y={24}>
            <SpaceImage image={spaceImages.recoverySuite} ratio="wide" />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
