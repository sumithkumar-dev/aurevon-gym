"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || open ? "bg-background/95 backdrop-blur border-b border-border" : "bg-transparent"
      )}
    >
      <div className="container-editorial flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl md:text-2xl uppercase tracking-widest2 shrink-0"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm uppercase tracking-wide transition-colors duration-300 hover:text-accent",
                pathname === item.href ? "text-accent" : "text-foreground/85"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="primary" size="default">
            Join Now
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          className="lg:hidden border-t border-border bg-background px-6 py-8"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-6">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block text-2xl font-display uppercase tracking-wide min-h-[44px] flex items-center",
                    pathname === item.href ? "text-accent" : "text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="primary" className="mt-8 w-full">
            Join Now
          </Button>
        </nav>
      )}
    </header>
  );
}
