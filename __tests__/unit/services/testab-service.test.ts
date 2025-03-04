import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestABService } from '@/lib/services/testab-service';
import {
  ExperimentDto,
  UserAssignmentDto,
  VariantDto,
} from '@/lib/dto/experiment.dto';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { TestABRepository } from '@/lib/repositories/interfaces';
import { fakeInt, fakeName, fakeUuid } from '../fake';

describe('TestABService', () => {
  let testABService: TestABService;
  let userRepositoryMock: TestABRepository;
  let authProviderMock: AuthProvider;

  beforeEach(() => {
    userRepositoryMock = {
      getExperiments: vi.fn(),
      getVariantsOfExperiment: vi.fn(),
      getUserAssignment: vi.fn(),
      saveUserAssignment: vi.fn(),
      updateResult: vi.fn(),
      getUserAssignmentId: vi.fn(),
    } as unknown as TestABRepository;

    authProviderMock = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    testABService = new TestABService(userRepositoryMock, authProviderMock);
  });

  describe('getExperiments', () => {
    it('should return the experiments', async () => {
      const experiments: ExperimentDto[] = [
        {
          name: 'Experiment 1',
          description: 'Description 1',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          metric: 'Number of Users',
        },
        {
          name: 'Experiment 2',
          description: 'Description 2',
          startDate: new Date('2023-02-01'),
          endDate: new Date('2023-02-28'),
          metric: 'Number of signed up users',
        },
      ];

      vi.spyOn(userRepositoryMock, 'getExperiments').mockResolvedValue(
        experiments,
      );

      const result = await testABService.getExperiments();

      expect(result).toEqual(experiments);
    });
  });

  describe('getVariantsOfExperiment', () => {
    it('should return the variants of the experiment', async () => {
      const variants: VariantDto[] = [
        {
          name: 'Variant 1',
          experimentName: 'Experiment 1',
          probability: 0.5,
        },
        {
          name: 'Variant 2',
          experimentName: 'Experiment 1',
          probability: 0.5,
        },
      ];

      vi.spyOn(userRepositoryMock, 'getVariantsOfExperiment').mockResolvedValue(
        variants,
      );
    });
  });

  describe('getUserAssignment', () => {
    it('should return the user assignment if already exists', async () => {
      const userId = fakeUuid();
      const experimentName = 'Experiment 1';

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepositoryMock, 'getUserAssignment').mockResolvedValue({
        userId: userId,
        experimentName: experimentName,
        variantName: 'Variant 1',
      });

      const result = await testABService.getUserAssignment(experimentName);

      expect(result).toEqual({
        userId: userId,
        experimentName: experimentName,
        variantName: 'Variant 1',
      });
    });

    it('should return a new user assignment if it does not exist', async () => {
      const userId = fakeUuid();
      const experimentName = 'Experiment 1';

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepositoryMock, 'getUserAssignment').mockResolvedValue(null);
      vi.spyOn(userRepositoryMock, 'getVariantsOfExperiment').mockResolvedValue(
        [
          {
            name: 'Variant 1',
            experimentName: experimentName,
            probability: 1,
          },
          {
            name: 'Variant 2',
            experimentName: experimentName,
            probability: 0,
          },
        ],
      );
      vi.spyOn(userRepositoryMock, 'saveUserAssignment').mockResolvedValue(
        undefined,
      );

      const result = await testABService.getUserAssignment(experimentName);

      expect(result).toEqual({
        userId: userId,
        experimentName: experimentName,
        variantName: 'Variant 1',
      });

      expect(userRepositoryMock.saveUserAssignment).toHaveBeenCalledWith({
        userId: userId,
        experimentName: experimentName,
        variantName: 'Variant 1',
      });
    });
  });

  describe('updateResult', () => {
    it('should update the result of the user assignment', async () => {
      const userId = fakeUuid();
      const userAssignmentId = fakeUuid();
      const experimentName = fakeName();
      const result = fakeInt(0, 100);

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepositoryMock, 'getUserAssignmentId').mockResolvedValue(
        userAssignmentId,
      );
      vi.spyOn(userRepositoryMock, 'updateResult').mockResolvedValue(undefined);

      await testABService.updateResult(experimentName, result);

      expect(userRepositoryMock.updateResult).toHaveBeenCalledWith(
        userAssignmentId,
        result,
      );
    });
  });
});
