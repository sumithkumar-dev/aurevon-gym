import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "A look inside Aurevon Studios.",
});

const galleryItems: { label: string; ratio: "square" | "portrait" | "landscape" | "wide" }[] = [
  { label: "[ Gallery Image — Main Floor ]", ratio: "landscape" },
  { label: "[ Gallery Image — Free Weights ]", ratio: "portrait" },
  { label: "[ Gallery Image — Coaching Session ]", ratio: "square" },
  { label: "[ Gallery Image — Conditioning Bay ]", ratio: "wide" },
  { label: "[ Gallery Image — Recovery Suite ]", ratio: "portrait" },
  { label: "[ Gallery Image — Detail Shot ]", ratio: "square" },
  { label: "[ Gallery Image — Entrance ]", ratio: "landscape" },
  { label: "[ Gallery Image — Member Session ]", ratio: "portrait" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The studio, in detail."
      />

      <Section className="pt-0" bleed>
        <div className="container-editorial columns-1 gap-8 sm:columns-2 lg:columns-3">
          {galleryItems.map((item, i) => (
            <Reveal
              key={item.label}
              delay={Math.min(i, 5) * 60}
              className="mb-8 break-inside-avoid"
            >
              <Placeholder label={item.label} ratio={i === 0 ? "wide" : item.ratio} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
