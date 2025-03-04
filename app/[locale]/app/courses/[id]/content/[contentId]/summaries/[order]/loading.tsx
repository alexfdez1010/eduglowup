import { getTip } from '@/app/api/tip/[locale]/tips';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Tip } from '@/components/general/Tip';
import { getLocale } from '@/lib/actions/utils';

export default async function Loading() {
  const locale = getLocale();

  const tip = getTip(locale);
  const dictionary = getDictionary(locale)['content'];

  return (
    <div className="flex flex-col justify-center items-center h-full w-11/12 md:w-[600px] mt-24">
      <Tip tip={tip} labelProgress={dictionary['creating-summary']} />
    </div>
  );
}
