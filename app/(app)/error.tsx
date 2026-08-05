"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-6">Error</p>
      <h1 className="font-display text-display-2 uppercase text-balance">
        Something went wrong.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
        We couldn&rsquo;t load this page. Try again, or head back to the
        homepage and sign in again.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button variant="primary" size="lg" onClick={reset}>
          Try Again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
