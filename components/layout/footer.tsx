import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { siteConfig, footerNav } from "@/lib/site-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-editorial py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-2xl uppercase tracking-widest2">
              {siteConfig.name}
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
          </div>

          <FooterColumn title="Studio" links={footerNav.studio} />
          <FooterColumn title="Membership" links={footerNav.membership} />

          <div>
            <h3 className="eyebrow mb-5">Contact</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>{siteConfig.address.line1}</li>
              <li>{siteConfig.address.line2}</li>
              <li>{siteConfig.address.city}</li>
              <li className="pt-2">
                <a href={siteConfig.phoneHref} className="hover:text-accent transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-5 pt-2">
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Aurevon Studios on WhatsApp"
                  className="text-muted transition-colors hover:text-accent"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Aurevon Studios on Instagram"
                  className="text-muted transition-colors hover:text-accent"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted">
            © {year} {siteConfig.name} Studios. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link
                href="/login"
                className="text-xs uppercase tracking-wide text-muted hover:text-accent transition-colors"
              >
                Sign In
              </Link>
            </li>
            {footerNav.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs uppercase tracking-wide text-muted hover:text-accent transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted hover:text-accent transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
