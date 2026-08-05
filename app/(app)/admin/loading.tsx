import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="container-editorial py-16">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-10 w-72 max-w-full" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border bg-surface p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border bg-surface p-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
