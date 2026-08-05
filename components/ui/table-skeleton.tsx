import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  rows = 6,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden border border-border bg-surface">
      <div className="border-b border-border px-6 py-4">
        <div className="flex gap-8">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex gap-8 border-b border-border px-6 py-5 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, col) => (
            <Skeleton
              key={col}
              className={col === 0 ? "h-4 w-28" : "h-4 w-16"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
