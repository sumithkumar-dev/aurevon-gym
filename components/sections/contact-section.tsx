import { Section, SectionHeading } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { ContactForm } from "@/components/ui/contact-form";
import { siteConfig } from "@/lib/site-data";

export function ContactSection() {
  return (
    <Section className="border-t border-border">
      <SectionHeading
        eyebrow="Visit The Studio"
        title="Come see the space."
        description="Book a walkthrough, ask about membership, or just say hello — we respond to every message personally."
      />

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <ContactForm />
        </div>

        <div className="lg:col-span-5 lg:col-start-8 space-y-8">
          <Placeholder label="[ Embedded Map Placeholder ]" ratio="landscape" />

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
              <a href={`tel:${siteConfig.phone}`} className="hover:text-accent transition-colors">
                {siteConfig.phone}
              </a>
              <br />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-accent transition-colors">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
