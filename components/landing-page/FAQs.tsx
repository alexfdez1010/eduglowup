'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';

interface FAQsProps {
  faqs: { question: string; answer: string }[];
}

export default function FAQs({ faqs }: FAQsProps) {
  return (
    <Accordion variant="bordered">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          title={<span className="font-semibold">{faq.question}</span>}
          textValue={faq.answer}
          HeadingComponent={'h3'}
          keepContentMounted={true}
        >
          {faq.answer}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
