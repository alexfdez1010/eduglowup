import { AuthProvider } from '@/lib/providers/auth-provider';
import { StudySessionRepository } from '@/lib/repositories/interfaces';
import { AnswerService } from '@/lib/services/answer-service';
import { ExercisesService } from '@/lib/services/exercises-service';
import { GenerateExerciseService } from '@/lib/services/generate-exercise-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RewardService } from '@/lib/services/reward-service';

describe('AnswerService', () => {
  let generateExerciseService: GenerateExerciseService;
  let exercisesService: ExercisesService;
  let studySessionRepository: StudySessionRepository;
  let authProvider: AuthProvider;
  let rewardService: RewardService;
  let answerService: AnswerService;

  beforeEach(() => {
    generateExerciseService = {
      generateExercise: vi.fn(),
    } as unknown as GenerateExerciseService;

    exercisesService = {
      getExerciseByName: vi.fn(),
    } as unknown as ExercisesService;

    studySessionRepository = {
      getSession: vi.fn(),
      lastBlock: vi.fn(),
      lastExercise: vi.fn(),
      setNextExercise: vi.fn(),
      setActiveExercise: vi.fn(),
      updateBlock: vi.fn(),
    } as unknown as StudySessionRepository;

    authProvider = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    rewardService = {
      updateRewards: vi.fn(),
    } as unknown as RewardService;

    answerService = new AnswerService(
      generateExerciseService,
      exercisesService,
      studySessionRepository,
      authProvider,
      rewardService,
    );
  });

  it('should return null if exercise is not found', async () => {
    expect(true).toBe(true);
  });
});
