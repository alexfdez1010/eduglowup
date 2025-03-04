import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { i18n } from '@/i18n-config';
import LandingPage from '@/components/landing-page/LandingPage';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ params: { locale } }));
}

export default async function HomePage({ params }: LocalePageProps) {
  const dictionaryHome = getDictionary(params.locale)['home'];

  const dictionaryFaqs = getDictionary(params.locale)['faqs'];

  const dictionaryScience = getDictionary(params.locale)['science'];

  return (
    <LandingPage
      landingDictionary={dictionaryHome}
      faqsDictionary={dictionaryFaqs}
      scienceDictionary={dictionaryScience}
    />
  );
}
