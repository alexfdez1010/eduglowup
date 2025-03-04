import { StreakRepository } from '@/lib/repositories/interfaces';
import {
  statisticsGeneralService,
  StatisticsGeneralService,
} from '@/lib/services/statistics-general-service';
import { StreakDto, StreakWithLastWeekDto } from '@/lib/dto/streak.dto';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { minusDays, todayString } from '@/lib/utils/date';
import { GeneralStatisticsDto } from '@/lib/dto/statistics.dto';
import { repositories } from '@/lib/repositories/repositories';

export class StreakService {
  private readonly streakRepository: StreakRepository;
  private readonly statisticsGeneralService: StatisticsGeneralService;
  private readonly authProvider: AuthProvider;

  constructor(
    streakRepository: StreakRepository,
    statisticsGeneralService: StatisticsGeneralService,
    authProvider: AuthProvider,
  ) {
    this.streakRepository = streakRepository;
    this.statisticsGeneralService = statisticsGeneralService;
    this.authProvider = authProvider;
  }

  async getStreak(): Promise<StreakWithLastWeekDto> {
    const userId = await this.authProvider.getUserId();

    const [streak, statsLastWeek] = await Promise.all([
      this.recoverStreak(userId),
      this.statisticsGeneralService.getLastWeekStudying(userId),
    ]);

    streak.currentStreak =
      streak.lastStreakDate === todayString() ? streak.currentStreak : 0;

    const booleanStreak = this.statsToStreak(statsLastWeek);

    return {
      ...streak,
      lastWeekStreak: booleanStreak,
    };
  }

  async updateStreak(): Promise<void> {
    const userId = await this.authProvider.getUserId();

    const streak = await this.recoverStreak(userId);

    if (streak.lastStreakDate === todayString()) {
      return;
    }

    if (streak.lastStreakDate === minusDays(1)) {
      streak.currentStreak++;
    } else {
      streak.currentStreak = 1;
    }

    streak.lastStreakDate = todayString();
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

    await this.streakRepository.updateCreateStreak(streak);
  }

  private async recoverStreak(userId: string): Promise<StreakDto> {
    const streak = await this.streakRepository.getStreak(userId);

    if (!streak) {
      return {
        userId: userId,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: '',
      };
    }

    return streak;
  }

  private statsToStreak(stats: GeneralStatisticsDto[]): boolean[] {
    return stats.map(
      (stat) =>
        stat.totalConceptQuestions > 0 ||
        stat.totalQuizQuestions > 0 ||
        stat.totalTrueFalseQuestions > 0 ||
        stat.totalShortQuestions > 0 ||
        stat.totalFlashcards > 0,
    );
  }
}

export const streakService = new StreakService(
  repositories.streak,
  statisticsGeneralService,
  authProvider,
);
