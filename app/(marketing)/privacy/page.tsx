import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Aurevon Studios collects, uses, and protects your information.",
});

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="August 1, 2026">
      <section>
        <h2>Information We Collect</h2>
        <p>
          When you inquire about membership, contact the studio, or sign up
          in person, we collect information such as your name, email
          address, phone number, and any details you choose to share about
          your training goals.
        </p>
      </section>
      <section>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information you provide to respond to inquiries,
          manage memberships, communicate about studio updates, and improve
          the services we offer. We do not sell member information to
          third parties.
        </p>
      </section>
      <section>
        <h2>Data Security</h2>
        <p>
          We take reasonable administrative and technical measures to
          protect the information you share with us. No method of
          transmission or storage is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </section>
      <section>
        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your
          personal information at any time by contacting us at{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
            {siteConfig.email}
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be directed to {siteConfig.name}{" "}
          Studios at {siteConfig.address.line1}, {siteConfig.address.city}.
        </p>
      </section>
    </LegalPage>
  );
}
