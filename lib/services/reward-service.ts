import {
  DocumentRepository,
  RewardRepository,
} from '@/lib/repositories/interfaces';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import {
  economicService,
  EconomicService,
} from '@/lib/services/economic-service';
import { Reward, RewardDto } from '@/lib/reward/reward';
import { removeDuplicates } from '@/lib/utils/general';
import { ReportReward } from '@/lib/reward/report';
import { repositories } from '@/lib/repositories/repositories';
import { DocumentDto } from '@/lib/dto/document.dto';

export class RewardService {
  private readonly rewardRepository: RewardRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly economicService: EconomicService;
  private readonly authProvider: AuthProvider;

  constructor(
    rewardRepository: RewardRepository,
    documentRepository: DocumentRepository,
    economicService: EconomicService,
    authProvider: AuthProvider,
  ) {
    this.rewardRepository = rewardRepository;
    this.documentRepository = documentRepository;
    this.economicService = economicService;
    this.authProvider = authProvider;
  }

  async createRewards(rewards: Reward[]): Promise<void> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return;
    }

    await this.rewardRepository.createRewards(userId, rewards);
  }

  async getRewardsFulfilled(): Promise<RewardDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return [];
    }

    const rewards = await this.rewardRepository.getRewardsFulfilled(userId);

    return this.rewardsToDto(rewards);
  }

  async getRewardsNotFulfilled(): Promise<RewardDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return [];
    }

    const rewards = await this.rewardRepository.getRewardsNotFulfilled(userId);

    return this.rewardsToDto(rewards);
  }

  async updateRewards(report: ReportReward): Promise<RewardDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return;
    }

    const rewards = await this.rewardRepository.getRewardsNotFulfilled(userId);

    const rewardsToUpdate = [];

    for (const reward of rewards) {
      if (reward.update(report)) {
        rewardsToUpdate.push(reward);
      }
    }

    const fulfilledRewards = rewards.filter((reward) => reward.isFulfilled());

    Promise.all([
      this.updateRewardsOnDatabase(rewardsToUpdate),
      this.increaseMoneyOfFulfilledRewards(userId, fulfilledRewards),
    ]).catch((e) => console.error(e));

    return this.rewardsToDto(fulfilledRewards);
  }

  private async rewardsToDto(rewards: Reward[]): Promise<RewardDto[]> {
    const documentIds = removeDuplicates(
      rewards
        .map((reward) => reward.getDocumentId())
        .filter((documentId) => documentId),
    );

    let documents: DocumentDto[];

    if (documentIds.length === 0) {
      documents = [];
    } else {
      documents = await this.documentRepository.getDocuments(documentIds);
    }

    return rewards.map((reward) => {
      return {
        progressPercentage: reward.getPercentageProgress(),
        template: reward.template(),
        money: reward.getMoney(),
        goal: reward.getGoal(),
        documentName: documents.find(
          (document) => document.id === reward.getDocumentId(),
        )?.filename,
      };
    });
  }

  private async updateRewardsOnDatabase(rewards: Reward[]): Promise<void> {
    await Promise.all(
      rewards.map((reward) =>
        this.rewardRepository.updateReward(
          reward.getId(),
          reward.getProgress(),
          reward.isFulfilled(),
        ),
      ),
    );
  }

  private async increaseMoneyOfFulfilledRewards(
    userId: string,
    rewards: Reward[],
  ): Promise<void> {
    const money = rewards.reduce((acc, reward) => acc + reward.getMoney(), 0);

    if (money === 0) {
      return;
    }

    await this.economicService.addMoney(userId, money);
  }
}

export const rewardService = new RewardService(
  repositories.reward,
  repositories.document,
  economicService,
  authProvider,
);
