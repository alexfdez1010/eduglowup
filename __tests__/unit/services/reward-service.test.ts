import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RewardService } from '@/lib/services/reward-service';
import { EconomicService } from '@/lib/services/economic-service';
import { AuthProvider } from '@/lib/providers/auth-provider';
import {
  DocumentRepository,
  RewardRepository,
} from '@/lib/repositories/interfaces';
import { Reward } from '@/lib/reward/reward';
import { fakeArray, fakeUuid } from '@/__tests__/unit/fake';
import {
  DocumentCorrectRewardMother,
  DocumentMother,
  ReportRewardMother,
  RewardMother,
} from '@/__tests__/unit/object-mothers';

describe('RewardService', () => {
  let rewardService: RewardService;
  let rewardRepositoryMock: RewardRepository;
  let documentRepositoryMock: DocumentRepository;
  let economicServiceMock: EconomicService;
  let authProviderMock: AuthProvider;

  beforeEach(() => {
    rewardRepositoryMock = {
      createRewards: vi.fn(),
      getRewardsFulfilled: vi.fn(),
      getRewardsNotFulfilled: vi.fn(),
      updateReward: vi.fn(),
    } as unknown as RewardRepository;

    documentRepositoryMock = {
      getDocuments: vi.fn(),
    } as unknown as DocumentRepository;

    economicServiceMock = {
      addMoney: vi.fn(),
    } as unknown as EconomicService;

    authProviderMock = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    rewardService = new RewardService(
      rewardRepositoryMock,
      documentRepositoryMock,
      economicServiceMock,
      authProviderMock,
    );
  });

  describe('createRewards', () => {
    it('should create rewards', async () => {
      const userId = fakeUuid();
      const rewards = fakeArray(() => RewardMother.create(), 1, 10);

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(rewardRepositoryMock, 'createRewards').mockResolvedValue(
        undefined,
      );

      await rewardService.createRewards(rewards);

      expect(rewardRepositoryMock.createRewards).toHaveBeenCalledWith(
        userId,
        rewards,
      );
    });
  });

  describe('getRewardsFulfilled', () => {
    it('should return the rewards fulfilled', async () => {
      const userId = fakeUuid();
      const rewardsFulfilled = fakeArray(() => RewardMother.create(), 1, 10);
      const rewardsNotFulfilled = fakeArray(() => RewardMother.create(), 1, 10);

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(documentRepositoryMock, 'getDocuments').mockResolvedValue([]);
      vi.spyOn(rewardRepositoryMock, 'getRewardsFulfilled').mockResolvedValue(
        rewardsFulfilled,
      );
      vi.spyOn(
        rewardRepositoryMock,
        'getRewardsNotFulfilled',
      ).mockResolvedValue(rewardsNotFulfilled);

      await rewardService.getRewardsFulfilled();

      expect(rewardRepositoryMock.getRewardsFulfilled).toHaveBeenCalledWith(
        userId,
      );
      expect(
        rewardRepositoryMock.getRewardsNotFulfilled,
      ).not.toHaveBeenCalled();
    });
  });

  describe('getRewardsNotFulfilled', () => {
    it('should return the rewards not fulfilled', async () => {
      const userId = fakeUuid();
      const rewardsFulfilled = fakeArray(() => RewardMother.create(), 1, 10);
      const rewardsNotFulfilled = fakeArray(() => RewardMother.create(), 1, 10);

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(documentRepositoryMock, 'getDocuments').mockResolvedValue([]);
      vi.spyOn(rewardRepositoryMock, 'getRewardsFulfilled').mockResolvedValue(
        rewardsFulfilled,
      );
      vi.spyOn(
        rewardRepositoryMock,
        'getRewardsNotFulfilled',
      ).mockResolvedValue(rewardsNotFulfilled);

      await rewardService.getRewardsNotFulfilled();

      expect(rewardRepositoryMock.getRewardsFulfilled).not.toHaveBeenCalled();
      expect(rewardRepositoryMock.getRewardsNotFulfilled).toHaveBeenCalledWith(
        userId,
      );
    });
  });

  describe('updateRewards', () => {
    it('should work correctly', async () => {
      const userId = fakeUuid();
      const report = ReportRewardMother.create();
      const rewards = fakeArray(() => RewardMother.create(), 1, 10);

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(documentRepositoryMock, 'getDocuments').mockResolvedValue([]);
      vi.spyOn(
        rewardRepositoryMock,
        'getRewardsNotFulfilled',
      ).mockResolvedValue(rewards);
      vi.spyOn(rewardRepositoryMock, 'updateReward').mockResolvedValue(
        undefined,
      );
      vi.spyOn(economicServiceMock, 'addMoney').mockResolvedValue(undefined);

      await rewardService.updateRewards(report);

      expect(rewardRepositoryMock.getRewardsNotFulfilled).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should update the rewards if required', async () => {
      const userId = fakeUuid();
      const documentId = fakeUuid();

      const report = ReportRewardMother.create({
        documentId: documentId,
        correctQuestions: 10,
      });

      const rewards = [
        DocumentCorrectRewardMother.create({
          progress: 90,
          goal: 100,
          documentId: documentId,
        }),
      ];

      const documents = [DocumentMother.create({ id: documentId })];

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(documentRepositoryMock, 'getDocuments').mockResolvedValue(
        documents,
      );
      vi.spyOn(
        rewardRepositoryMock,
        'getRewardsNotFulfilled',
      ).mockResolvedValue(rewards);
      vi.spyOn(rewardRepositoryMock, 'updateReward').mockResolvedValue(
        undefined,
      );
      vi.spyOn(economicServiceMock, 'addMoney').mockResolvedValue(undefined);

      const result = await rewardService.updateRewards(report);

      const expectedResult = [
        {
          progressPercentage: 100,
          template: 'document-correct',
          money: rewards[0].getMoney(),
          goal: 100,
          documentName: documents[0].filename,
        },
      ];

      expect(result).toEqual(expectedResult);

      expect(rewardRepositoryMock.getRewardsNotFulfilled).toHaveBeenCalledWith(
        userId,
      );
      expect(rewardRepositoryMock.updateReward).toHaveBeenCalledWith(
        rewards[0].getId(),
        rewards[0].getProgress(),
        true,
      );
      expect(documentRepositoryMock.getDocuments).toHaveBeenCalledWith([
        documentId,
      ]);
      expect(economicServiceMock.addMoney).toHaveBeenCalledWith(
        userId,
        rewards[0].getMoney(),
      );
    });

    it('should not update the rewards if not required', async () => {
      const userId = fakeUuid();
      const documentId = fakeUuid();

      const report = ReportRewardMother.create({ documentId: documentId });

      const rewards = [
        DocumentCorrectRewardMother.create({ progress: 10, goal: 100 }),
      ];

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(
        rewardRepositoryMock,
        'getRewardsNotFulfilled',
      ).mockResolvedValue(rewards);
      vi.spyOn(rewardRepositoryMock, 'updateReward').mockResolvedValue(
        undefined,
      );
      vi.spyOn(economicServiceMock, 'addMoney').mockResolvedValue(undefined);

      const result = await rewardService.updateRewards(report);

      expect(result).toEqual([]);

      expect(rewardRepositoryMock.getRewardsNotFulfilled).toHaveBeenCalledWith(
        userId,
      );
      expect(rewardRepositoryMock.updateReward).not.toHaveBeenCalled();
      expect(economicServiceMock.addMoney).not.toHaveBeenCalled();
    });
  });
});
