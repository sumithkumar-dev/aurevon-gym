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
          className="font-display text-xl md:text-2xl uppercase tracking-widest2 shrink-0 transition-colors duration-300 hover:text-accent active:text-accent-bright"
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
                "group relative py-2 text-sm uppercase tracking-wide transition-colors duration-300 hover:text-accent active:text-accent-bright",
                pathname === item.href ? "text-accent" : "text-foreground/85"
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-editorial group-hover:scale-x-100",
                  pathname === item.href && "scale-x-100"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-6">
          <Link
            href="/login"
            className={cn(
              "text-sm uppercase tracking-wide transition-colors duration-300 hover:text-accent active:text-accent-bright",
              pathname === "/login" ? "text-accent" : "text-foreground/85"
            )}
          >
            Sign In
          </Link>
          <Button variant="primary" size="default" asChild>
            <Link href="/membership">Join Now</Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center text-foreground transition-all duration-200 ease-editorial hover:text-accent active:scale-90"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-6 w-6">
            <Menu
              className={cn(
                "absolute inset-0 h-6 w-6 transition-all duration-200 ease-editorial",
                open ? "scale-75 opacity-0" : "scale-100 opacity-100"
              )}
              aria-hidden="true"
            />
            <X
              className={cn(
                "absolute inset-0 h-6 w-6 transition-all duration-200 ease-editorial",
                open ? "scale-100 opacity-100" : "scale-75 opacity-0"
              )}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      <div
        className={cn(
          "grid lg:hidden transition-[grid-template-rows] duration-300 ease-editorial",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav
            className="border-t border-border bg-background px-6 py-8"
            aria-label="Mobile"
            aria-hidden={!open}
            inert={!open || undefined}
          >
            <ul className="flex flex-col gap-6">
              {mainNav.map((item, i) => (
                <li
                  key={item.href}
                  className={cn(
                    "transition-all duration-300 ease-editorial",
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  )}
                  style={{ transitionDelay: open ? `${i * 40 + 80}ms` : "0ms" }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block text-2xl font-display uppercase tracking-wide min-h-[44px] flex items-center transition-colors duration-200 hover:text-accent active:text-accent-bright",
                      pathname === item.href ? "text-accent" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button variant="primary" className="mt-8 w-full" asChild>
              <Link href="/membership">Join Now</Link>
            </Button>
            <Link
              href="/login"
              className="mt-6 block text-center text-sm uppercase tracking-wide text-foreground/85 transition-colors duration-200 hover:text-accent active:text-accent-bright min-h-[44px] flex items-center justify-center"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
