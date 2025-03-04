import {
  DocumentRepository,
  StatisticsRepository,
} from '@/lib/repositories/interfaces';
import { getDatesBetween, todayString, weekAgoString } from '@/lib/utils/date';
import {
  GeneralStatisticsDto,
  ItemStatistics,
  PartStatisticsDto,
} from '@/lib/dto/statistics.dto';
import { repositories } from '@/lib/repositories/repositories';
import { computeProgressByParts } from '@/lib/progress';

export class StatisticsGeneralService {
  private statisticsRepository: StatisticsRepository;
  private documentRepository: DocumentRepository;

  constructor(
    statisticsRepository: StatisticsRepository,
    documentRepository: DocumentRepository,
  ) {
    this.statisticsRepository = statisticsRepository;
    this.documentRepository = documentRepository;
  }

  async getTodayStudying(userId: string): Promise<GeneralStatisticsDto> {
    const today = todayString();

    const statsParts =
      await this.statisticsRepository.getAllStatisticsOfUserPart(
        userId,
        today,
        today,
      );

    const {
      totalConceptQuestions,
      correctConceptQuestions,
      totalFlashcards,
      correctFlashcards,
      totalQuizQuestions,
      correctQuizQuestions,
      totalShortQuestions,
      correctShortQuestions,
      totalTrueFalseQuestions,
      correctTrueFalseQuestions,
    } = this.sumStatsParts(statsParts);

    return {
      userId,
      date: today,
      totalConceptQuestions,
      correctConceptQuestions,
      totalFlashcards,
      correctFlashcards,
      totalQuizQuestions,
      correctQuizQuestions,
      totalShortQuestions,
      correctShortQuestions,
      totalTrueFalseQuestions,
      correctTrueFalseQuestions,
    };
  }

  async getLastWeekStudying(userId: string): Promise<GeneralStatisticsDto[]> {
    const today = todayString();
    const weekAgo = weekAgoString();

    const statsParts =
      await this.statisticsRepository.getAllStatisticsOfUserPart(
        userId,
        weekAgo,
        today,
      );

    const dates = getDatesBetween(weekAgo, today);
    const generalStats: GeneralStatisticsDto[] = [];

    for (const date of dates) {
      const statsPartsDate = statsParts.filter((stat) => stat.date === date);

      const {
        totalConceptQuestions,
        correctConceptQuestions,
        totalFlashcards,
        correctFlashcards,
        totalQuizQuestions,
        correctQuizQuestions,
        totalShortQuestions,
        correctShortQuestions,
        totalTrueFalseQuestions,
        correctTrueFalseQuestions,
      } = this.sumStatsParts(statsPartsDate);

      generalStats.push({
        userId,
        date,
        totalConceptQuestions,
        correctConceptQuestions,
        totalFlashcards,
        correctFlashcards,
        totalQuizQuestions,
        correctQuizQuestions,
        totalShortQuestions,
        correctShortQuestions,
        totalTrueFalseQuestions,
        correctTrueFalseQuestions,
      });
    }

    return generalStats.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  async getContentStatisticsByPart(
    contentId: string,
    userId: string,
  ): Promise<ItemStatistics[]> {
    const { allPartsStatistics, parts } = await this.getDataOfContent(
      userId,
      contentId,
    );

    const progressByPart = computeProgressByParts(parts, allPartsStatistics);

    return parts.map((part) => ({
      name: part.name,
      progress: progressByPart.get(part.id),
    }));
  }

  private sumStatsParts(statsParts: PartStatisticsDto[]): {
    totalConceptQuestions: number;
    correctConceptQuestions: number;
    totalFlashcards: number;
    correctFlashcards: number;
    totalQuizQuestions: number;
    correctQuizQuestions: number;
    totalShortQuestions: number;
    correctShortQuestions: number;
    totalTrueFalseQuestions: number;
    correctTrueFalseQuestions: number;
  } {
    return statsParts.reduce(
      (acc, stat) => {
        acc.totalConceptQuestions += stat.totalConceptQuestions;
        acc.correctConceptQuestions += stat.correctConceptQuestions;
        acc.totalFlashcards += stat.totalFlashcards;
        acc.correctFlashcards += stat.correctFlashcards;
        acc.totalQuizQuestions += stat.totalQuizQuestions;
        acc.correctQuizQuestions += stat.correctQuizQuestions;
        acc.totalShortQuestions += stat.totalShortQuestions;
        acc.correctShortQuestions += stat.correctShortQuestions;
        acc.totalTrueFalseQuestions += stat.totalTrueFalseQuestions;
        acc.correctTrueFalseQuestions += stat.correctTrueFalseQuestions;
        return acc;
      },
      {
        totalConceptQuestions: 0,
        correctConceptQuestions: 0,
        totalFlashcards: 0,
        correctFlashcards: 0,
        totalQuizQuestions: 0,
        correctQuizQuestions: 0,
        totalShortQuestions: 0,
        correctShortQuestions: 0,
        totalTrueFalseQuestions: 0,
        correctTrueFalseQuestions: 0,
      },
    );
  }

  private async getDataOfContent(userId: string, contentId: string) {
    const [allPartsStatistics, parts] = await Promise.all([
      this.statisticsRepository.getAllPartsStatistics(userId, contentId),
      this.documentRepository.getPartsByDocument(contentId),
    ]);

    return {
      allPartsStatistics,
      parts,
    };
  }
}

export const statisticsGeneralService = new StatisticsGeneralService(
  repositories.statistics,
  repositories.document,
);
