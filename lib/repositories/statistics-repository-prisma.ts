import { StatisticsRepository } from '@/lib/repositories/interfaces';
import { PrismaClient } from '@prisma/client';
import {
  PartStatisticsDto,
  PartStatisticsWithDateDto,
} from '@/lib/dto/statistics.dto';
import { todayString } from '@/lib/utils/date';

export class StatisticsRepositoryPrisma implements StatisticsRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getPartStatistics(
    userId: string,
    partId: string,
  ): Promise<PartStatisticsDto> {
    const statistics = await this.client.statisticsPart.aggregate({
      where: {
        userId: userId,
        partId: partId,
      },
      _sum: {
        totalConceptQuestions: true,
        correctConceptQuestions: true,
        totalFlashcards: true,
        correctFlashcards: true,
        totalQuizQuestions: true,
        correctQuizQuestions: true,
        totalShortQuestions: true,
        correctShortQuestions: true,
        totalTrueFalseQuestions: true,
        correctTrueFalseQuestions: true,
      },
    });

    return {
      partId: partId,
      userId: userId,
      totalConceptQuestions: statistics._sum.totalConceptQuestions ?? 0,
      correctConceptQuestions: statistics._sum.correctConceptQuestions ?? 0,
      totalFlashcards: statistics._sum.totalFlashcards ?? 0,
      correctFlashcards: statistics._sum.correctFlashcards ?? 0,
      totalQuizQuestions: statistics._sum.totalQuizQuestions ?? 0,
      correctQuizQuestions: statistics._sum.correctQuizQuestions ?? 0,
      totalShortQuestions: statistics._sum.totalShortQuestions ?? 0,
      correctShortQuestions: statistics._sum.correctShortQuestions ?? 0,
      totalTrueFalseQuestions: statistics._sum.totalTrueFalseQuestions ?? 0,
      correctTrueFalseQuestions: statistics._sum.correctTrueFalseQuestions ?? 0,
    };
  }

  async createOrUpdatePartStatistics(
    statistics: PartStatisticsWithDateDto,
  ): Promise<void> {
    await this.client.statisticsPart.upsert({
      where: {
        userId_partId_date: {
          partId: statistics.partId,
          userId: statistics.userId,
          date: statistics.date,
        },
      },
      update: {
        totalConceptQuestions: statistics.totalConceptQuestions,
        correctConceptQuestions: statistics.correctConceptQuestions,
        totalFlashcards: statistics.totalFlashcards,
        correctFlashcards: statistics.correctFlashcards,
        totalQuizQuestions: statistics.totalQuizQuestions,
        correctQuizQuestions: statistics.correctQuizQuestions,
        totalShortQuestions: statistics.totalShortQuestions,
        correctShortQuestions: statistics.correctShortQuestions,
        totalTrueFalseQuestions: statistics.totalTrueFalseQuestions,
        correctTrueFalseQuestions: statistics.correctTrueFalseQuestions,
      },
      create: {
        userId: statistics.userId,
        partId: statistics.partId,
        date: statistics.date,
        totalConceptQuestions: statistics.totalConceptQuestions,
        correctConceptQuestions: statistics.correctConceptQuestions,
        totalFlashcards: statistics.totalFlashcards,
        correctFlashcards: statistics.correctFlashcards,
        totalQuizQuestions: statistics.totalQuizQuestions,
        correctQuizQuestions: statistics.correctQuizQuestions,
        totalShortQuestions: statistics.totalShortQuestions,
        correctShortQuestions: statistics.correctShortQuestions,
        totalTrueFalseQuestions: statistics.totalTrueFalseQuestions,
        correctTrueFalseQuestions: statistics.correctTrueFalseQuestions,
      },
    });
  }

  async getPartStatisticsToday(
    userId: string,
    partId: string,
  ): Promise<PartStatisticsWithDateDto | null> {
    const today = todayString();

    const statisticsRecovered = await this.client.statisticsPart.findFirst({
      where: {
        userId: userId,
        partId: partId,
        date: today,
      },
      select: {
        totalConceptQuestions: true,
        correctConceptQuestions: true,
        totalFlashcards: true,
        correctFlashcards: true,
        totalQuizQuestions: true,
        correctQuizQuestions: true,
        totalShortQuestions: true,
        correctShortQuestions: true,
        totalTrueFalseQuestions: true,
        correctTrueFalseQuestions: true,
      },
    });

    if (!statisticsRecovered) {
      return null;
    }

    return {
      partId: partId,
      userId: userId,
      date: today,
      totalConceptQuestions: statisticsRecovered.totalConceptQuestions,
      correctConceptQuestions: statisticsRecovered.correctConceptQuestions,
      totalFlashcards: statisticsRecovered.totalFlashcards,
      correctFlashcards: statisticsRecovered.correctFlashcards,
      totalQuizQuestions: statisticsRecovered.totalQuizQuestions,
      correctQuizQuestions: statisticsRecovered.correctQuizQuestions,
      totalShortQuestions: statisticsRecovered.totalShortQuestions,
      correctShortQuestions: statisticsRecovered.correctShortQuestions,
      totalTrueFalseQuestions: statisticsRecovered.totalTrueFalseQuestions,
      correctTrueFalseQuestions: statisticsRecovered.correctTrueFalseQuestions,
    };
  }

  async getAllPartsStatistics(
    userId: string,
    documentId: string,
  ): Promise<PartStatisticsDto[]> {
    const statisticsRecovered = await this.client.statisticsPart.groupBy({
      by: ['partId'],
      where: {
        userId: userId,
        part: {
          documentId: documentId,
        },
      },
      _sum: {
        totalConceptQuestions: true,
        correctConceptQuestions: true,
        totalFlashcards: true,
        correctFlashcards: true,
        totalQuizQuestions: true,
        correctQuizQuestions: true,
        totalShortQuestions: true,
        correctShortQuestions: true,
        totalTrueFalseQuestions: true,
        correctTrueFalseQuestions: true,
      },
    });

    return statisticsRecovered.map((stat) => ({
      partId: stat.partId,
      userId: userId,
      totalConceptQuestions: stat._sum.totalConceptQuestions ?? 0,
      correctConceptQuestions: stat._sum.correctConceptQuestions ?? 0,
      totalFlashcards: stat._sum.totalFlashcards ?? 0,
      correctFlashcards: stat._sum.correctFlashcards ?? 0,
      totalQuizQuestions: stat._sum.totalQuizQuestions ?? 0,
      correctQuizQuestions: stat._sum.correctQuizQuestions ?? 0,
      totalShortQuestions: stat._sum.totalShortQuestions ?? 0,
      correctShortQuestions: stat._sum.correctShortQuestions ?? 0,
      totalTrueFalseQuestions: stat._sum.totalTrueFalseQuestions ?? 0,
      correctTrueFalseQuestions: stat._sum.correctTrueFalseQuestions ?? 0,
    }));
  }

  private getWhereClauseWithDate(
    userId: string,
    startDate?: string,
    endDate?: string,
  ) {
    let whereClause = {
      userId: userId,
    };

    if (startDate) {
      whereClause['date'] = {
        gte: startDate,
      };
    }

    if (endDate) {
      whereClause['date'] = {
        ...whereClause['date'],
        lte: endDate,
      };
    }

    return whereClause;
  }

  async getAllStatisticsOfUserPart(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PartStatisticsWithDateDto[]> {
    const whereClause = this.getWhereClauseWithDate(userId, startDate, endDate);

    const statisticsRecovered = await this.client.statisticsPart.findMany({
      where: whereClause,
      select: {
        partId: true,
        date: true,
        totalConceptQuestions: true,
        correctConceptQuestions: true,
        totalFlashcards: true,
        correctFlashcards: true,
        totalQuizQuestions: true,
        correctQuizQuestions: true,
        totalShortQuestions: true,
        correctShortQuestions: true,
        totalTrueFalseQuestions: true,
        correctTrueFalseQuestions: true,
      },
    });

    return statisticsRecovered.map((stat) => {
      return {
        partId: stat.partId,
        userId: userId,
        date: stat.date,
        totalConceptQuestions: stat.totalConceptQuestions,
        correctConceptQuestions: stat.correctConceptQuestions,
        totalFlashcards: stat.totalFlashcards,
        correctFlashcards: stat.correctFlashcards,
        totalQuizQuestions: stat.totalQuizQuestions,
        correctQuizQuestions: stat.correctQuizQuestions,
        totalShortQuestions: stat.totalShortQuestions,
        correctShortQuestions: stat.correctShortQuestions,
        totalTrueFalseQuestions: stat.totalTrueFalseQuestions,
        correctTrueFalseQuestions: stat.correctTrueFalseQuestions,
      };
    });
  }
}
