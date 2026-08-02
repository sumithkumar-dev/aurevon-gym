import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow mb-6">Error 404</p>
      <h1 className="font-display text-display-1 uppercase text-balance">
        This page didn&rsquo;t make the cut.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        Let&rsquo;s get you back on track.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button variant="primary" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
