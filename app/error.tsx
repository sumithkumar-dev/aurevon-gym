"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side log only — no user data, just enough to correlate with
    // server logs via the digest Next.js attaches to production errors.
    console.error(error);
  }, [error]);

  return (
    <div className="container-editorial flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow mb-6">Error</p>
      <h1 className="font-display text-display-1 uppercase text-balance">
        Something went wrong.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
        We hit an unexpected error loading this page. It&rsquo;s on us — try
        again, or head back home.
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
