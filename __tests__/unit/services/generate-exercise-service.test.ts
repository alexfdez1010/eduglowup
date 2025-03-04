import { describe, it, expect, beforeEach, vi } from 'vitest';

import { GenerateExerciseService } from '@/lib/services/generate-exercise-service';
import { EconomicService } from '@/lib/services/economic-service';
import { SelectService } from '@/lib/services/select-service';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { StudySessionRepository } from '@/lib/repositories/interfaces';
import { fakeUuid } from '../fake';
import { BlockTypeDto } from '@/lib/dto/block.dto';
import {
  BlockMother,
  DocumentMother,
  PartMother,
  StudySessionMother,
} from '../object-mothers';
import { Exercise } from '@/lib/exercises/interface';
import { GenerateRewardService } from '@/lib/services/generate-reward-service';

describe('GenerateExerciseService', () => {
  let generateExerciseService: GenerateExerciseService;

  let studySessionRepository: StudySessionRepository;
  let economicService: EconomicService;
  let selectService: SelectService;
  let authProvider: AuthProvider;
  let generateRewardService: GenerateRewardService;

  beforeEach(() => {
    studySessionRepository = {
      getSession: vi.fn(),
      getNextExercise: vi.fn(),
      setNextExercise: vi.fn(),
      setActiveExercise: vi.fn(),
      addBlock: vi.fn(),
      getDocumentOfSession: vi.fn(),
      lastBlock: vi.fn(),
    } as unknown as StudySessionRepository;

    economicService = {
      chargeExercise: vi.fn(),
      hasEnoughMoneyForExercise: vi.fn(),
    } as unknown as EconomicService;

    selectService = {
      nextPartAndExercise: vi.fn(),
    } as unknown as SelectService;

    authProvider = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    generateRewardService = {
      createDocumentRewards: vi.fn(),
    } as unknown as GenerateRewardService;

    vi.spyOn(generateRewardService, 'createDocumentRewards').mockResolvedValue(
      undefined,
    );

    generateExerciseService = new GenerateExerciseService(
      studySessionRepository,
      economicService,
      selectService,
      authProvider,
      generateRewardService,
    );
  });

  describe('getExercise', () => {
    it('should retry to get the exercise if the first time it fails', async () => {
      const sessionId = fakeUuid();
      const userId = fakeUuid();

      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

      vi.spyOn(studySessionRepository, 'getNextExercise')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(BlockMother.create({ type: BlockTypeDto.QUIZ }));

      vi.spyOn(studySessionRepository, 'setNextExercise').mockResolvedValue(
        undefined,
      );
      vi.spyOn(studySessionRepository, 'setActiveExercise').mockResolvedValue(
        undefined,
      );
      vi.spyOn(studySessionRepository, 'addBlock').mockResolvedValue(undefined);
      vi.spyOn(
        studySessionRepository,
        'getDocumentOfSession',
      ).mockResolvedValue(DocumentMother.create());

      const result = await generateExerciseService.getExercise(sessionId);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(studySessionRepository.getNextExercise).toHaveBeenCalledWith(
        sessionId,
      );
      expect(studySessionRepository.setNextExercise).toHaveBeenCalledWith(
        sessionId,
        null,
      );
      expect(studySessionRepository.setActiveExercise).toHaveBeenCalledWith(
        sessionId,
        true,
      );
      expect(studySessionRepository.addBlock).toHaveBeenCalledWith(
        sessionId,
        result,
      );
    });
  });

  describe('generateExercise', () => {
    it('should generate an exercise successfully', async () => {
      const sessionId = fakeUuid();
      const session = StudySessionMother.create({ id: sessionId });

      const userId = fakeUuid();
      const document = DocumentMother.create();
      const part = PartMother.create({ documentId: document.id });
      const exercise = {
        create: vi.fn(),
      } as unknown as Exercise;

      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(studySessionRepository, 'getSession').mockResolvedValue(session);
      vi.spyOn(
        studySessionRepository,
        'getDocumentOfSession',
      ).mockResolvedValue(document);
      vi.spyOn(studySessionRepository, 'lastBlock').mockResolvedValue(
        BlockMother.create({ type: BlockTypeDto.QUIZ }),
      );

      vi.spyOn(selectService, 'nextPartAndExercise').mockResolvedValue([
        part,
        exercise,
      ]);

      vi.spyOn(exercise, 'create').mockResolvedValue(
        BlockMother.create({ type: BlockTypeDto.QUIZ }),
      );

      vi.spyOn(studySessionRepository, 'setNextExercise').mockResolvedValue(
        undefined,
      );

      const result = await generateExerciseService.generateExercise(sessionId);

      expect(result).toBeTruthy();

      expect(selectService.nextPartAndExercise).toHaveBeenCalledWith(
        document.id,
        userId,
        session.exercises,
      );
      expect(exercise.create).toHaveBeenCalledWith(part, session.language);
      expect(studySessionRepository.setNextExercise).toHaveBeenCalledWith(
        sessionId,
        result,
      );
    });
  });
});
