import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="container-editorial flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <Skeleton className="mx-auto h-3 w-24" />
        <Skeleton className="mx-auto mt-4 h-8 w-48" />
        <Skeleton className="mt-8 h-11 w-full" />
        <Skeleton className="mt-4 h-11 w-full" />
      </div>
    </div>
  );
}
