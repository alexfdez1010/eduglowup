import MemberComponent from '@/components/landing-page/MemberComponent';
import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import AboutUs from '@/components/landing-page/AboutUs';
import Story from '@/components/landing-page/Story';

export default async function AboutUsPage({ params }: LocalePageProps) {
  const locale = params.locale;

  const dictionary = getDictionary(locale)['about'];

  return (
    <div className="flex flex-col gap-8 mt-8 w-11/12 items-center">
      <h1 className="text-4xl font-bold text-center my-5">
        {dictionary['about-title']}
      </h1>
      <AboutUs localeDictionary={dictionary} />
      <Story localeDictionary={dictionary} />
    </div>
  );
}
