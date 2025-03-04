import { BlockDto } from '@/lib/dto/block.dto';
import { AnswerType } from '@/lib/exercises/interface';
import { authProvider, AuthProvider } from '../providers/auth-provider';
import { StudySessionRepository } from '../repositories/interfaces';
import { repositories } from '../repositories/repositories';
import { exercisesService, ExercisesService } from './exercises-service';
import {
  generateExerciseService,
  GenerateExerciseService,
} from '@/lib/services/generate-exercise-service';
import { rewardService, RewardService } from '@/lib/services/reward-service';
import { RewardDto } from '@/lib/reward/reward';

export class AnswerService {
  private readonly generateExerciseService: GenerateExerciseService;
  private readonly exercisesService: ExercisesService;
  private readonly studySessionRepository: StudySessionRepository;
  private readonly authProvider: AuthProvider;
  private readonly rewardService: RewardService;

  constructor(
    generateExerciseService: GenerateExerciseService,
    exercisesService: ExercisesService,
    studySessionRepository: StudySessionRepository,
    authProvider: AuthProvider,
    rewardService: RewardService,
  ) {
    this.generateExerciseService = generateExerciseService;
    this.exercisesService = exercisesService;
    this.studySessionRepository = studySessionRepository;
    this.authProvider = authProvider;
    this.rewardService = rewardService;
  }

  async answer(
    sessionId: string,
    exerciseName: string,
    answer: AnswerType,
  ): Promise<[BlockDto, RewardDto[]] | null> {
    const exercise = this.exercisesService.getExerciseByName(exerciseName);

    if (!exercise) {
      return null;
    }

    const userId = await this.authProvider.getUserId();

    const [[block, reportReward], lastBlock] = await Promise.all([
      exercise.answer(userId, answer),
      this.studySessionRepository.lastBlock(sessionId),
    ]);

    block.id = lastBlock.id;
    block.order = lastBlock.order;

    await this.studySessionRepository.setNextExercise(sessionId, null);

    Promise.all([
      this.generateExerciseService.generateExercise(sessionId),
      this.studySessionRepository.updateBlock(block),
      this.studySessionRepository.setActiveExercise(sessionId, false),
    ]).catch(console.error);

    const rewards = await this.rewardService.updateRewards(reportReward);

    return [block, rewards];
  }
}

export const answerService = new AnswerService(
  generateExerciseService,
  exercisesService,
  repositories.studySession,
  authProvider,
  rewardService,
);
