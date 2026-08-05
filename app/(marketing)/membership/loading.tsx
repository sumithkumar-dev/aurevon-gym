import { Skeleton } from "@/components/ui/skeleton";

export default function MembershipPageLoading() {
  return (
    <>
      <div className="container-editorial pb-16 pt-40 md:pb-20 md:pt-48">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-6 h-14 w-96 max-w-full" />
        <Skeleton className="mt-6 h-4 w-full max-w-xl" />
      </div>

      <div className="container-editorial pb-section">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border bg-surface p-8 md:p-10">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="mt-6 h-12 w-28" />
              <Skeleton className="mt-4 h-4 w-full" />
              <div className="my-8 h-px w-full bg-border" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="mt-10 h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
