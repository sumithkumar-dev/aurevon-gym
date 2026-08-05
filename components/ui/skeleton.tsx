import { cn } from "@/lib/utils";

/**
 * Loading placeholder block. Uses the same surface/border tokens as the
 * rest of the UI so skeletons read as "this brand, loading" rather than a
 * generic gray box. Respects prefers-reduced-motion globally via the
 * `animation-duration` override in app/globals.css.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse bg-surface", className)}
    />
  );
}
