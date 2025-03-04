import { StatisticsRepository } from '@/lib/repositories/interfaces';
import { todayString } from '@/lib/utils/date';
import { repositories } from '@/lib/repositories/repositories';
import {
  competitionService,
  CompetitionService,
} from '@/lib/services/competition-service';
import {
  certificateService,
  CertificateService,
} from '@/lib/services/certificate-service';

export class StatisticsUpdateService {
  private readonly repository: StatisticsRepository;
  private readonly competitionService: CompetitionService;
  private readonly certificateService: CertificateService;

  constructor(
    repository: StatisticsRepository,
    competitionService: CompetitionService,
    certificateService: CertificateService,
  ) {
    this.repository = repository;
    this.competitionService = competitionService;
    this.certificateService = certificateService;
  }

  async updateStatistics(
    userId: string,
    partId: string,
    totalQuestions: number,
    correctAnswers: number,
    exerciseType: 'quiz' | 'concept' | 'flashcards' | 'short' | 'true-false',
  ): Promise<void> {
    let statistics = await this.repository.getPartStatisticsToday(
      userId,
      partId,
    );

    if (!statistics) {
      statistics = {
        partId: partId,
        userId: userId,
        date: todayString(),
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
      };
    }

    switch (exerciseType) {
      case 'quiz':
        statistics.totalQuizQuestions += totalQuestions;
        statistics.correctQuizQuestions += correctAnswers;
        break;
      case 'concept':
        statistics.totalConceptQuestions += totalQuestions;
        statistics.correctConceptQuestions += correctAnswers;
        break;
      case 'short':
        statistics.totalShortQuestions += totalQuestions;
        statistics.correctShortQuestions += correctAnswers;
        break;
      case 'true-false':
        statistics.totalTrueFalseQuestions += totalQuestions;
        statistics.correctTrueFalseQuestions += correctAnswers;
        break;
      case 'flashcards':
        statistics.totalFlashcards += totalQuestions;
        statistics.correctFlashcards += correctAnswers;
        break;
    }

    await Promise.all([
      this.repository.createOrUpdatePartStatistics(statistics),
      this.competitionService.increaseScore(correctAnswers),
    ]);

    await this.certificateService.sendCertificateIfNeeded(userId, partId);
  }
}

export const statisticsUpdateService = new StatisticsUpdateService(
  repositories.statistics,
  competitionService,
  certificateService,
);
