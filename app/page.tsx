import { Hero } from "@/components/sections/hero";
import { Philosophy } from "@/components/sections/philosophy";
import { TheSpace } from "@/components/sections/the-space";
import { TrainersSection } from "@/components/sections/trainers-section";
import { MemberResults } from "@/components/sections/member-results";
import { MembershipSection } from "@/components/sections/membership-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <TheSpace />
      <TrainersSection />
      <MemberResults />
      <MembershipSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
