import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsLoading() {
  return (
    <div className="container-editorial py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-10 w-64 max-w-full" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border bg-surface p-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-8 w-28" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-6 h-11 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
