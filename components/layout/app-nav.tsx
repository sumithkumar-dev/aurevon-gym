"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";
import { isStaff, type Role } from "@/lib/permissions/roles";

const STAFF_LINKS = [
  { href: ROUTES.admin, label: "Dashboard" },
  { href: ROUTES.adminMembers, label: "Members" },
  { href: ROUTES.adminPlans, label: "Plans" },
  { href: ROUTES.adminPayments, label: "Payments" },
] as const;

const MEMBER_LINKS = [
  { href: ROUTES.member, label: "Dashboard" },
  { href: ROUTES.payments, label: "Payments" },
  { href: ROUTES.profile, label: "Profile" },
  { href: ROUTES.settings, label: "Settings" },
] as const;

/**
 * Persistent section navigation for the signed-in portal ((app) route
 * group). Without this, a page like /admin/members/[id] or
 * /admin/plans/new has no way back to its parent list other than the
 * browser's own Back button — this renders the same tabs on every page
 * so Members/Plans/Payments/Dashboard (or the member equivalents) are
 * always one click away.
 */
export function AppNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const links = isStaff(role) ? STAFF_LINKS : MEMBER_LINKS;

  return (
    <nav
      className="border-b border-border bg-background"
      aria-label="Account"
    >
      <div className="container-editorial flex h-12 items-center gap-8 overflow-x-auto">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== ROUTES.admin &&
              link.href !== ROUTES.member &&
              pathname.startsWith(`${link.href}/`));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap text-sm uppercase tracking-wide transition-colors duration-200 hover:text-accent",
                active ? "text-accent" : "text-foreground/70"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
