import type { ReactNode } from "react";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth/session";
import { signOutAction } from "@/features/auth/sign-out/actions";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-data";
import { ROLE_LABELS } from "@/lib/permissions/roles";
import { AppNav } from "@/components/layout/app-nav";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-[100svh] flex-col bg-background">
      <header className="border-b border-border">
        <div className="container-editorial flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl md:text-2xl uppercase tracking-widest2 text-foreground"
          >
            {siteConfig.name}
          </Link>

          {profile && (
            <div className="flex items-center gap-6">
              <span className="hidden text-sm text-muted sm:inline">
                {profile.full_name || profile.email}
                <span className="ml-2 text-accent">
                  {ROLE_LABELS[profile.role]}
                </span>
              </span>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost">
                  Sign Out
                </Button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Persistent section tabs — this is what lets someone get from,
          say, /admin/members/[id] back to the Members list (or over to
          Plans/Payments) without relying on the browser's Back button,
          which previously was the only way to navigate the portal. */}
      {profile && <AppNav role={profile.role} />}

      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}
