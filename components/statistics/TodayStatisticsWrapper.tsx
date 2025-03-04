import { statisticsGeneralService } from '@/lib/services/statistics-general-service';
import TodayStatistics from '@/components/statistics/TodayStatistics';

interface TodayStatisticsProps {
  userId: string;
}

export default async function TodayStatisticsWrapper({
  userId,
}: TodayStatisticsProps) {
  const statistics = await statisticsGeneralService.getTodayStudying(userId);

  return <TodayStatistics generalStatistics={statistics} />;
}
