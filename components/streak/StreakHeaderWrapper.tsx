import { rewardService } from '@/lib/services/reward-service';
import { streakService } from '@/lib/services/streak-service';
import StreakTracker from '@/components/streak/StreakTracker';

export default async function StreakHeaderWrapper() {
  const streak = await streakService.getStreak();

  return <StreakTracker streak={streak} />;
}
