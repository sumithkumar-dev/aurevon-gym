import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function AdminPlansLoading() {
  return (
    <div className="container-editorial py-16">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-10 w-40" />
      <Skeleton className="mt-4 h-4 w-96 max-w-full" />
      <div className="mt-10">
        <TableSkeleton rows={5} columns={5} />
      </div>
    </div>
  );
}
