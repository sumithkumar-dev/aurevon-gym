import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { spaceImages } from "@/lib/site-images";
import type { SiteImage } from "@/types/site";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description: "A look inside Aurevon Studios.",
});

const galleryItems: { image: SiteImage; ratio: "square" | "portrait" | "landscape" | "wide" }[] = [
  { image: spaceImages.mainFloor, ratio: "wide" },
  { image: spaceImages.freeWeights, ratio: "portrait" },
  { image: spaceImages.coachingSession, ratio: "square" },
  { image: spaceImages.conditioningBay, ratio: "landscape" },
  { image: spaceImages.recoverySuite, ratio: "portrait" },
  { image: spaceImages.detailedEquipment, ratio: "square" },
  { image: spaceImages.gymEntrance, ratio: "landscape" },
  { image: spaceImages.memberTraining, ratio: "portrait" },
];

const ratioClasses: Record<(typeof galleryItems)[number]["ratio"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

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
              key={item.image.src}
              delay={Math.min(i, 5) * 60}
              className="mb-8 break-inside-avoid"
            >
              <div
                className={`relative w-full overflow-hidden border border-border ${ratioClasses[item.ratio]}`}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
