import {
  economicService,
  EconomicService,
} from '@/lib/services/economic-service';
import { StudySessionRepository } from '@/lib/repositories/interfaces';
import { selectService, SelectService } from '@/lib/services/select-service';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { BlockDto } from '@/lib/dto/block.dto';
import { repositories } from '@/lib/repositories/repositories';
import {
  generateRewardService,
  GenerateRewardService,
} from '@/lib/services/generate-reward-service';

export class GenerateExerciseService {
  private readonly studySessionRepository: StudySessionRepository;
  private readonly economicService: EconomicService;
  private readonly selectService: SelectService;
  private readonly authProvider: AuthProvider;
  private readonly generateRewardService: GenerateRewardService;

  constructor(
    studySessionRepository: StudySessionRepository,
    economicService: EconomicService,
    selectService: SelectService,
    authProvider: AuthProvider,
    generateRewardService: GenerateRewardService,
  ) {
    this.studySessionRepository = studySessionRepository;
    this.economicService = economicService;
    this.selectService = selectService;
    this.authProvider = authProvider;
    this.generateRewardService = generateRewardService;
  }

  async generateExercise(sessionId: string): Promise<BlockDto> {
    const userId = await this.authProvider.getUserId();

    const [session, document, lastBlock] = await Promise.all([
      this.studySessionRepository.getSession(sessionId),
      this.studySessionRepository.getDocumentOfSession(sessionId),
      this.studySessionRepository.lastBlock(sessionId),
    ]);

    if (!document) {
      throw new Error('StudyClass does not have any document');
    }

    this.generateRewardService
      .createDocumentRewards(document.id)
      .catch((e) => console.error(e));

    const [nextPart, exercise] = await this.selectService.nextPartAndExercise(
      document.id,
      userId,
      session.exercises,
    );

    const block = await exercise.create(nextPart, session.language);

    if (!lastBlock) {
      block.order = 0;
    } else {
      block.order = lastBlock.order + 1;
    }

    this.studySessionRepository
      .setNextExercise(session.id, block)
      .catch((e) => {
        console.error(e);
      });

    return block;
  }

  async getExercise(sessionId: string): Promise<BlockDto | null> {
    const userId = await this.authProvider.getUserId();

    const nextExercise = await this.recoverExercise(sessionId);

    Promise.all([
      this.studySessionRepository.setNextExercise(sessionId, null),
      this.studySessionRepository.setActiveExercise(sessionId, true),
      this.studySessionRepository.addBlock(sessionId, nextExercise),
    ]).catch((e) => {
      console.error(e);
    });

    return nextExercise;
  }

  private async recoverExercise(sessionId: string) {
    let nextExercise: BlockDto | null;

    let count = 0;

    nextExercise = await this.studySessionRepository.getNextExercise(sessionId);

    while (!nextExercise && count < 10) {
      await this.wait(1000);
      nextExercise =
        await this.studySessionRepository.getNextExercise(sessionId);
      count++;
    }

    if (!nextExercise) {
      nextExercise = await this.generateExercise(sessionId);
    }

    return nextExercise;
  }

  private async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const generateExerciseService = new GenerateExerciseService(
  repositories.studySession,
  economicService,
  selectService,
  authProvider,
  generateRewardService,
);
