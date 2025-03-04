import Hero from '@/components/landing-page/Hero';
import Processes from '@/components/landing-page/Processes';
import FAQsHome from '@/components/landing-page/FAQSHome';
import ScienceBehind from '@/components/landing-page/ScienceBehind';
import NewsMentions from '@/components/landing-page/NewsMentions';
import Testimonials from '@/components/landing-page/Testimonials';

interface LandingPageProps {
  landingDictionary: Record<string, string>;
  faqsDictionary: Record<string, string>;
  scienceDictionary: Record<string, string>;
}

export default function LandingPage({
  landingDictionary,
  faqsDictionary,
  scienceDictionary,
}: LandingPageProps) {
  return (
    <div className="w-11/12 max-w-6xl flex flex-col justify-start items-center gap-10 mt-5">
      <Hero localeDictionary={landingDictionary} />
      <Testimonials localeDictionary={landingDictionary} />
      <NewsMentions localeDictionary={landingDictionary} />
      <Processes localeDictionary={landingDictionary} />
      <FAQsHome localeDictionary={faqsDictionary} />
      <ScienceBehind localeDictionary={scienceDictionary} />
    </div>
  );
}
