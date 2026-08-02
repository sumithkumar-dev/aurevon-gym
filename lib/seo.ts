import type { Metadata } from "next";

/**
 * Builds page metadata that also sets matching Open Graph fields.
 * Without this, pages that only set `title`/`description` inherit the
 * root layout's Open Graph object wholesale (Next.js merges `openGraph`
 * as a single object, not field-by-field) — meaning every shared link
 * would show the homepage's title/description regardless of which page
 * was actually shared.
 */
export function pageMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
  };
}
