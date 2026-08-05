import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function AdminMemberDetailLoading() {
  return (
    <div className="container-editorial py-16">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="mt-4 h-10 w-64 max-w-full" />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-border bg-surface p-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
        <div className="border border-border bg-surface p-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="mb-4 h-4 w-40" />
        <TableSkeleton rows={4} columns={4} />
      </div>
    </div>
  );
}
