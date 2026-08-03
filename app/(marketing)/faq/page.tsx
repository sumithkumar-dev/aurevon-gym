import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { FaqSection } from "@/components/sections/faq-section";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: "Frequently asked questions about membership at Aurevon Studios.",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Everything you're wondering."
      />
      <FaqSection />
    </>
  );
}
