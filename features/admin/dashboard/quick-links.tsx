import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const LINKS = [
  {
    href: ROUTES.adminMembers,
    label: "Members",
    description: "Search members and manage account status",
  },
  {
    href: ROUTES.adminPlans,
    label: "Plans",
    description: "Create and edit membership plans",
  },
  {
    href: ROUTES.adminPayments,
    label: "Payments",
    description: "Record an offline payment or view history",
  },
] as const;

export function QuickLinks() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex flex-col justify-between border border-border bg-surface p-6 transition-colors duration-300 ease-editorial hover:border-accent-dim"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="font-display text-lg uppercase text-foreground">
              {link.label}
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-muted transition-colors duration-300 ease-editorial group-hover:text-accent"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 text-sm text-muted">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
