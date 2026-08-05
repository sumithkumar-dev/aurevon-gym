"use client";

import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>
        <div className="container-editorial flex min-h-[100svh] flex-col items-center justify-center py-32 text-center">
          <p className="eyebrow mb-6">Error</p>
          <h1 className="font-display text-display-1 uppercase text-balance">
            Something went wrong.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            The studio site hit an unexpected error. Try reloading — if this
            keeps happening, reach out and we&rsquo;ll take a look.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 items-center justify-center border border-foreground bg-foreground px-8 text-sm uppercase tracking-wide text-background transition-colors duration-300 hover:bg-accent hover:border-accent"
            >
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                Deliberate plain <a>, not <Link>: this file replaces the
                entire root layout (including its providers/router
                context) when something in that layout itself throws, so
                it must not depend on client-side routing that may be
                part of what's broken. A full page load is the only
                navigation guaranteed to work here. */}
            <a
              href="/"
              className="inline-flex h-12 items-center justify-center border border-border px-8 text-sm uppercase tracking-wide text-foreground transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Back to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
