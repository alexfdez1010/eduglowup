import FAQs from './FAQs';
import { faqsFromText } from './utils';
import { PulsatingButton } from '@/components/landing-page/PulsatingButton';
import Link from 'next/link';

interface FAQsHomeProps {
  localeDictionary: Record<string, string>;
}

export default function FAQsHome({ localeDictionary }: FAQsHomeProps) {
  const faqs = faqsFromText(localeDictionary['faqs']);

  return (
    <section className="flex flex-col justify-center items-center gap-5 w-full md:w-[800px]">
      <h2 className="text-center font-bold text-2xl w-full">
        {localeDictionary['title']}
      </h2>
      <FAQs faqs={faqs} />
      <PulsatingButton className="max-w-lg">
        <Link href="/sign-up">{localeDictionary['cta']}</Link>
      </PulsatingButton>
    </section>
  );
}
