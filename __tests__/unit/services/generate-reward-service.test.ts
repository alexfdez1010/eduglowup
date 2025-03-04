import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GenerateRewardService } from '@/lib/services/generate-reward-service';
import { fakeUuid } from '@/__tests__/unit/fake';
import { RewardRepository } from '@/lib/repositories/interfaces';
import { AuthProvider } from '@/lib/providers/auth-provider';

describe('GenerateRewardService', () => {
  let generateRewardService: GenerateRewardService;
  let rewardRepositoryMock: RewardRepository;
  let authProviderMock: AuthProvider;

  beforeEach(() => {
    rewardRepositoryMock = {
      createRewards: vi.fn(),
      hasInitialRewards: vi.fn(),
      hasDocumentRewards: vi.fn(),
    } as unknown as RewardRepository;

    authProviderMock = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    generateRewardService = new GenerateRewardService(
      rewardRepositoryMock,
      authProviderMock,
    );
  });

  describe('createInitialRewards', () => {
    it('should create initial rewards correctly', async () => {
      const userId = fakeUuid();

      vi.spyOn(rewardRepositoryMock, 'createRewards').mockResolvedValue(
        undefined,
      );

      await generateRewardService.createInitialRewards(userId);

      expect(rewardRepositoryMock.createRewards).toHaveBeenCalled();
    });
  });

  describe('createDocumentRewards', () => {
    it('should create document rewards correctly', async () => {
      const userId = fakeUuid();
      const documentId = fakeUuid();

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(rewardRepositoryMock, 'hasDocumentRewards').mockResolvedValue(
        false,
      );
      vi.spyOn(rewardRepositoryMock, 'createRewards').mockResolvedValue(
        undefined,
      );

      await generateRewardService.createDocumentRewards(documentId);

      expect(rewardRepositoryMock.hasDocumentRewards).toHaveBeenCalledWith(
        userId,
        documentId,
      );
    });
  });
});
