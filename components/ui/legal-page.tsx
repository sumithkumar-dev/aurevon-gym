import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/motion/reveal";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="container-editorial pb-section">
        <p className="mb-12 text-xs uppercase tracking-wide text-muted">
          Last updated {updated}
        </p>
        <Reveal className="max-w-2xl space-y-8 text-sm md:text-base leading-relaxed text-muted [&_h2]:mt-4 [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:uppercase [&_h2]:tracking-wide [&_strong]:text-foreground">
          {children}
        </Reveal>
      </div>
    </>
  );
}
