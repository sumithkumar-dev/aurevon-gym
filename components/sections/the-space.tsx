import { Section, SectionHeading } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";

export function TheSpace() {
  return (
    <Section className="border-t border-border" bleed>
      <div className="container-editorial">
        <SectionHeading
          eyebrow="The Space"
          title="Built for the work, not the photos."
          description="Twelve thousand square feet across three floors — a free-weight floor, a conditioning bay, and a private recovery suite. Every corner was chosen for function first."
        />
      </div>

      {/* Row 1: large image left, supporting text right */}
      <div className="container-editorial mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Placeholder label="[ Gym Interior — Main Floor ]" ratio="wide" />
        </div>
        <div className="lg:col-span-4">
          <span className="eyebrow">01 — Main Floor</span>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Competition platforms, a full free-weight range, and unobstructed
            sightlines from every corner of the room.
          </p>
        </div>
      </div>

      {/* Row 2: asymmetrical, two smaller images offset */}
      <div className="container-editorial mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Placeholder label="[ Equipment Image — Racks ]" ratio="portrait" />
          <div className="mt-4">
            <span className="eyebrow">02 — Equipment</span>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Commercial-grade racks, plates, and specialty bars, maintained
              and inspected weekly.
            </p>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:mt-24">
          <Placeholder label="[ Equipment Image — Conditioning Bay ]" ratio="portrait" />
          <div className="mt-4">
            <span className="eyebrow">03 — Conditioning</span>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A dedicated bay for engine work, kept separate from the
              strength floor so both can be used properly.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: full-bleed wide, text overlay style */}
      <div className="container-editorial mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <span className="eyebrow">04 — Recovery Suite</span>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Cold plunge, sauna, and mobility bay — reserved for Gold and
              Elite members, available every day the studio is open.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Placeholder label="[ Gym Interior — Recovery Suite ]" ratio="wide" />
          </div>
        </div>
      </div>
    </Section>
  );
}
