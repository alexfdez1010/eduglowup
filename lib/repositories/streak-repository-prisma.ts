import { StreakRepository } from '@/lib/repositories/interfaces';
import { PrismaClient } from '@prisma/client';
import { dateToString, stringToDate } from '@/lib/utils/date';
import { StreakDto } from '@/lib/dto/streak.dto';

export class StreakRepositoryPrisma implements StreakRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getStreak(userId: string): Promise<StreakDto> {
    const streak = await this.client.streak.findFirst({
      where: {
        userId: userId,
      },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastStreakDate: true,
      },
    });

    if (!streak) {
      return null;
    }

    return {
      userId: userId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastStreakDate: dateToString(streak.lastStreakDate),
    };
  }

  async updateCreateStreak(streak: StreakDto): Promise<void> {
    await this.client.streak.upsert({
      where: {
        userId: streak.userId,
      },
      update: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastStreakDate: stringToDate(streak.lastStreakDate),
      },
      create: {
        userId: streak.userId,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastStreakDate: stringToDate(streak.lastStreakDate),
      },
    });
  }
}
