'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Markdown from 'react-markdown';

interface AccordionScienceProps {
  scienceFacts: { title: string; explanation: string }[];
}

export default function AccordionScience({
  scienceFacts,
}: AccordionScienceProps) {
  return (
    <Accordion variant="bordered">
      {scienceFacts.map((fact, index) => (
        <AccordionItem
          key={index}
          HeadingComponent={'h3'}
          title={<span className="font-semibold">{fact.title}</span>}
          textValue={fact.explanation}
          keepContentMounted={true}
        >
          <Markdown className="prose dark:prose-invert max-w-none w-full prose-a:text-primary text-pretty">
            {fact.explanation}
          </Markdown>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
