import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms governing membership and use of Aurevon Studios.",
});

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="August 1, 2026">
      <section>
        <h2>Membership</h2>
        <p>
          Membership at {siteConfig.name} Studios is offered on a
          month-to-month basis unless otherwise agreed in writing. Members
          are responsible for keeping billing information current.
        </p>
      </section>
      <section>
        <h2>Facility Use</h2>
        <p>
          Members agree to follow posted studio guidelines, treat
          equipment and staff with respect, and use the facility only
          during their membership&rsquo;s designated access hours.
        </p>
      </section>
      <section>
        <h2>Cancellation & Freezes</h2>
        <p>
          Memberships may be cancelled with 30 days&rsquo; written notice.
          Freeze requests are available for up to two months per year and
          must be submitted in advance.
        </p>
      </section>
      <section>
        <h2>Assumption of Risk</h2>
        <p>
          Physical training carries inherent risk. By training at{" "}
          {siteConfig.name} Studios, members acknowledge this risk and
          agree to follow coaching guidance and safety protocols.
        </p>
      </section>
      <section>
        <h2>Changes to These Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of
          the facility after changes take effect constitutes acceptance of
          the revised terms.
        </p>
      </section>
    </LegalPage>
  );
}
