import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { statisticsGeneralService } from '@/lib/services/statistics-general-service';
import ListStatistics from '@/components/statistics/ListStatistics';
import { authProvider } from '@/lib/providers/auth-provider';

export default async function Page({ params }: LocalePagePropsWithId) {
  const dictionary = getDictionary(params.locale)['statistics'];
  const documentId = params.id;
  const userId = await authProvider.getUserId();

  const parts = await statisticsGeneralService.getContentStatisticsByPart(
    documentId,
    userId,
  );

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mt-24">
      <ListStatistics title={dictionary['parts']} items={parts} />
    </div>
  );
}
