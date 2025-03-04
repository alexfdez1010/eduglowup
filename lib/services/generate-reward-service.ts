import { templatesToRewards } from '@/lib/reward/template';
import { initialRewards } from '@/lib/reward/initial-rewards';
import { documentRewards } from '@/lib/reward/document-rewards';
import { RewardRepository } from '@/lib/repositories/interfaces';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { repositories } from '@/lib/repositories/repositories';

export class GenerateRewardService {
  private readonly rewardRepository: RewardRepository;
  private readonly authProvider: AuthProvider;

  constructor(rewardRepository: RewardRepository, authProvider: AuthProvider) {
    this.rewardRepository = rewardRepository;
    this.authProvider = authProvider;
  }

  async createInitialRewards(userId: string): Promise<void> {
    const rewards = templatesToRewards(initialRewards);

    await this.rewardRepository.createRewards(userId, rewards);
  }

  async createDocumentRewards(documentId: string): Promise<boolean> {
    const rewards = templatesToRewards(documentRewards);

    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return false;
    }

    if (await this.rewardRepository.hasDocumentRewards(userId, documentId)) {
      return false;
    }

    rewards.forEach((reward) => reward.setDocumentId(documentId));
    this.rewardRepository
      .createRewards(userId, rewards)
      .catch((e) => console.error(e));
    return true;
  }
}

export const generateRewardService = new GenerateRewardService(
  repositories.reward,
  authProvider,
);
