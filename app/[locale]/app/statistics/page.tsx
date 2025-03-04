import { LocalePageProps } from '@/app/[locale]/interfaces';
import TodayStatisticsWrapper from '@/components/statistics/TodayStatisticsWrapper';
import LastWeekStatisticsWrapper from '@/components/statistics/LastWeekStatisticsWrapper';
import { authProvider } from '@/lib/providers/auth-provider';
import ListCoursesWrapper from '@/components/statistics/ListCoursesWrapper';
import { getDictionary } from '@/app/[locale]/dictionaries';
import Title from '@/components/general/Title';

export default async function Page({ params }: LocalePageProps) {
  const userId = await authProvider.getUserId();

  const dictionary = getDictionary(params.locale)['statistics'];

  return (
    <>
      <Title title={dictionary['statistics']} />
      <div className="flex flex-row flex-wrap md:gap-4 gap-12 justify-center items-center my-4 w-full">
        <TodayStatisticsWrapper userId={userId} />
        <LastWeekStatisticsWrapper userId={userId} />
        <ListCoursesWrapper locale={params.locale} />
      </div>
    </>
  );
}
