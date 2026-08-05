import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Prev/Next paging for a server-rendered list. Deliberately plain links
 * (not client-side state) — the list itself is a Server Component, so
 * paging is just a navigation to `?page=N` with whatever other search
 * params (e.g. `search`) already applied, same pattern as the existing
 * search form in `MembersTable`.
 */
export function Pagination({
  basePath,
  currentPage,
  totalPages,
  searchParams,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
  /** Other search params (e.g. `{ search: "jordan" }`) to preserve across page links. */
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(page: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-border pt-6"
    >
      <p className="text-sm text-muted">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-3">
        <PaginationLink href={hrefFor(currentPage - 1)} disabled={!hasPrev}>
          Previous
        </PaginationLink>
        <PaginationLink href={hrefFor(currentPage + 1)} disabled={!hasNext}>
          Next
        </PaginationLink>
      </div>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  const className = cn(
    "inline-flex h-10 items-center justify-center border border-border px-5 text-sm uppercase tracking-wide transition-colors duration-300 ease-editorial",
    disabled
      ? "cursor-not-allowed text-muted/50"
      : "text-foreground hover:border-accent hover:text-accent",
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
