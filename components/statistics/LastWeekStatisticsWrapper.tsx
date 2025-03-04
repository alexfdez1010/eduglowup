import { statisticsGeneralService } from '@/lib/services/statistics-general-service';
import LastWeekStatistics from '@/components/statistics/LastWeekStatistics';

interface LastWeekStatisticsWrapperProps {
  userId: string;
}

export default async function LastWeekStatisticsWrapper({
  userId,
}: LastWeekStatisticsWrapperProps) {
  const statistics = await statisticsGeneralService.getLastWeekStudying(userId);

  return <LastWeekStatistics generalStatistics={statistics} />;
}
