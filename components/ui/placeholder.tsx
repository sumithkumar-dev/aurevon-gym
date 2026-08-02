import { cn } from "@/lib/utils";

interface PlaceholderProps {
  label: string;
  ratio?: "square" | "portrait" | "landscape" | "wide" | "cinematic";
  className?: string;
}

const ratioClasses: Record<NonNullable<PlaceholderProps["ratio"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  cinematic: "aspect-[21/9]",
};

/**
 * Elegant placeholder for future media assets.
 * Preserves the exact layout footprint so real images/video can be
 * dropped in later (Phase 2) without any redesign.
 */
export function Placeholder({ label, ratio = "landscape", className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "group relative w-full overflow-hidden border border-border bg-surface transition-colors duration-500 ease-editorial hover:border-accent-dim",
        ratioClasses[ratio],
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.05] transition-transform duration-500 ease-editorial group-hover:scale-105"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <span className="font-body text-[11px] md:text-xs uppercase tracking-widest2 text-muted text-center transition-colors duration-500 ease-editorial group-hover:text-foreground/80">
          {label}
        </span>
      </div>
      <div className="absolute left-4 top-4 h-2.5 w-2.5 border-l border-t border-accent-dim transition-colors duration-300 ease-editorial group-hover:border-accent" />
      <div className="absolute bottom-4 right-4 h-2.5 w-2.5 border-b border-r border-accent-dim transition-colors duration-300 ease-editorial group-hover:border-accent" />
    </div>
  );
}
