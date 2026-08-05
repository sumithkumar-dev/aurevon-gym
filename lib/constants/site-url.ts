/**
 * The site's canonical public base URL — single source of truth for
 * `metadataBase`, `robots.ts`, and `sitemap.ts`, all of which need the
 * same absolute origin. Previously each of those hardcoded its own copy
 * of a placeholder domain, so changing it (e.g. re-skinning this template
 * for a different studio, per the README) meant remembering to edit three
 * files instead of one — and `NEXT_PUBLIC_SITE_URL` already existed for
 * this exact purpose (see `.env.example`) but wasn't actually wired up to
 * any of them.
 *
 * Falls back to the same placeholder those files used before, so local
 * dev / a missing env var doesn't crash the build.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aurevon.example";
