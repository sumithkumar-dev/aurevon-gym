import { Section, SectionHeading } from "@/components/ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/site-data";

export function FaqSection() {
  return (
    <Section className="border-t border-border">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="FAQ" title="Questions, answered." />
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Section>
  );
}
