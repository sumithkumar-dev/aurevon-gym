import { Skeleton } from "@/components/ui/skeleton";

export default function MemberDashboardLoading() {
  return (
    <div className="container-editorial py-16">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-10 w-72 max-w-full" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />

      <div className="mt-10 flex flex-col gap-10">
        <div className="border border-border bg-surface p-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-6 w-32" />
          <Skeleton className="mt-3 h-4 w-full max-w-sm" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border bg-surface p-6">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="mt-3 h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
