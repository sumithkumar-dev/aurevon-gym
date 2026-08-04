import { Instagram, MessageCircle } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { ContactForm } from "@/components/ui/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site-data";

export function ContactSection() {
  return (
    <Section className="border-t border-border">
      <Reveal>
        <SectionHeading
          eyebrow="Visit The Studio"
          title="Come see the space."
          description="Book a walkthrough, ask about membership, or just say hello — we respond to every message personally."
        />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <ContactForm />
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8 space-y-8" delay={100}>
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-border">
            <iframe
              src={siteConfig.mapEmbedSrc}
              title="Aurevon Studios location — Hanamkonda, Telangana"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          <div>
            <span className="eyebrow">Address</span>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {siteConfig.address.line1}
              <br />
              {siteConfig.address.line2}
              <br />
              {siteConfig.address.city}
            </p>
          </div>

          <div>
            <span className="eyebrow">Hours</span>
            <dl className="mt-3 space-y-2">
              {siteConfig.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 text-sm">
                  <dt className="text-foreground/90">{h.days}</dt>
                  <dd className="text-muted">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <span className="eyebrow">Reach Us</span>
            <p className="mt-3 text-sm text-muted">
              <a href={siteConfig.phoneHref} className="hover:text-accent transition-colors">
                {siteConfig.phone}
              </a>
              <br />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent transition-colors">
                {siteConfig.email}
              </a>
            </p>
            <div className="mt-4 flex items-center gap-5">
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
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
