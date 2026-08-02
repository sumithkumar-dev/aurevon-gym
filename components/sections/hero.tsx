import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background flex items-end">
      {/*
        Reserved cinematic area. In Phase 2, replace this container's
        contents with a <video> or WebGL canvas — the layout, gradient
        scrim, and text positioning are designed to remain unchanged.
      */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, hsl(var(--surface)) 0px, hsl(var(--surface)) 1px, transparent 1px, transparent 16px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-body text-xs uppercase tracking-widest2 text-muted">
            [ Hero Cinematic Placeholder ]
          </span>
        </div>
      </div>

      <div className="container-editorial relative z-10 pb-20 pt-40 md:pb-28">
        <p className="eyebrow mb-6 animate-fade-up [animation-delay:0.1s] opacity-0">
          Aurevon Studios — Private Training
        </p>

        <h1 className="font-display text-hero uppercase text-balance animate-fade-up [animation-delay:0.2s] opacity-0">
          Strength is
          <br />
          built.
        </h1>

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base md:text-lg text-muted leading-relaxed animate-fade-up [animation-delay:0.35s] opacity-0">
            Not a class. Not a franchise. A single, considered space for
            training that&rsquo;s coached, measured, and built around you —
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
