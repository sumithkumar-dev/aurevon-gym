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
        "relative w-full overflow-hidden border border-border bg-surface",
        ratioClasses[ratio],
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <span className="font-body text-[11px] md:text-xs uppercase tracking-widest2 text-muted text-center">
          {label}
        </span>
      </div>
      <div className="absolute left-4 top-4 h-2.5 w-2.5 border-l border-t border-accent-dim" />
      <div className="absolute bottom-4 right-4 h-2.5 w-2.5 border-b border-r border-accent-dim" />
    </div>
  );
}
