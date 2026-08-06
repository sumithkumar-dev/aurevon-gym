import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Aurevon Studios – visit, call, or send a message.",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk."
        description="Whether you're ready to join or just have a question about the studio, we respond to every message personally, usually within one business day."
      />
      <ContactSection />
    </>
  );
}
