import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Explicit "back to the list" link for drill-down admin pages (a member's
 * detail page, editing a plan, recording a payment). These pages sit one
 * level below a list page with no other link back to it — `AppNav`'s tabs
 * cover top-level sections, but not this one-level-deeper case — so
 * without this the browser's own Back button was the only way back.
 */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-muted transition-colors duration-200 hover:text-accent"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
