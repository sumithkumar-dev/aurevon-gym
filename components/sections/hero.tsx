import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { spaceImages } from "@/lib/site-images";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background flex items-end">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={spaceImages.mainFloor.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
      </div>

      <div className="container-editorial relative z-10 pb-20 pt-40 md:pb-28">
        <p className="eyebrow mb-6 animate-fade-up [animation-delay:0.1s] opacity-0">
          Aurevon Studios – Private Training
        </p>

        <h1 className="font-display text-hero uppercase text-balance animate-fade-up [animation-delay:0.2s] opacity-0">
          Strength is
          <br />
          built.
        </h1>

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base md:text-lg text-muted leading-relaxed animate-fade-up [animation-delay:0.35s] opacity-0">
            Not a class. Not a franchise. A single, considered space for
            training that&rsquo;s coached, measured, and built around you –
            one member at a time.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row animate-fade-up [animation-delay:0.5s] opacity-0">
            <Button variant="primary" size="lg" asChild>
              <Link href="/membership">Join Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/membership">Explore Memberships</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
