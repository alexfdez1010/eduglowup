import { RewardRepository } from '@/lib/repositories/interfaces';
import {
  PrismaClient,
  Reward as RewardModel,
  RewardType,
} from '@prisma/client';
import { Reward } from '@/lib/reward/reward';
import {
  DocumentCorrectReward,
  DocumentTotalReward,
} from '@/lib/reward/reward-document';
import { UserCorrectReward, UserTotalReward } from '@/lib/reward/reward-user';
import {
  FirstExerciseReward,
  FirstQuizReward,
  FirstTrueFalseReward,
  AllCorrectQuizReward,
  AllCorrectConceptsReward,
} from '@/lib/reward/reward-exercise';

export class RewardRepositoryPrisma implements RewardRepository {
  private client: PrismaClient;

  private static readonly rewardTypeToClass: Array<
    [RewardType, new (...args: any[]) => Reward]
  > = [
    [RewardType.DocumentCorrect, DocumentCorrectReward],
    [RewardType.DocumentTotal, DocumentTotalReward],
    [RewardType.FirstExercise, FirstExerciseReward],
    [RewardType.FirstQuiz, FirstQuizReward],
    [RewardType.FirstTrueFalse, FirstTrueFalseReward],
    [RewardType.AllCorrectQuiz, AllCorrectQuizReward],
    [RewardType.AllCorrectConcepts, AllCorrectConceptsReward],
    [RewardType.UserCorrect, UserCorrectReward],
    [RewardType.UserTotal, UserTotalReward],
  ];

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async createRewards(userId: string, rewards: Reward[]): Promise<void> {
    const rewardsToCreate = rewards.map((reward) =>
      this.rewardToPrisma(userId, reward),
    );

    await this.client.reward.createMany({
      data: rewardsToCreate,
    });
  }

  async getRewardsFulfilled(userId: string): Promise<Reward[]> {
    const rewards = await this.client.reward.findMany({
      where: {
        userId: userId,
        fulfilled: true,
      },
      include: {
        user: true,
      },
    });

    return rewards.map((reward) => this.prismaToReward(reward));
  }

  async getRewardsNotFulfilled(userId: string): Promise<Reward[]> {
    const rewards = await this.client.reward.findMany({
      where: {
        userId: userId,
        fulfilled: false,
      },
      include: {
        user: true,
      },
    });

    return rewards.map((reward) => this.prismaToReward(reward));
  }

  async updateReward(
    rewardId: string,
    progress: number,
    isFulfilled: boolean,
  ): Promise<void> {
    await this.client.reward.update({
      where: {
        id: rewardId,
      },
      data: {
        progress: progress,
        fulfilled: isFulfilled,
      },
    });
  }

  async hasInitialRewards(userId: string): Promise<boolean> {
    const reward = await this.client.reward.findFirst({
      where: {
        userId: userId,
        type: RewardType.UserCorrect,
      },
    });

    return reward !== null;
  }

  async hasDocumentRewards(
    userId: string,
    documentId: string,
  ): Promise<boolean> {
    const reward = await this.client.reward.findFirst({
      where: {
        userId: userId,
        documentId: documentId,
        type: RewardType.DocumentTotal,
      },
    });

    return reward !== null;
  }

  private prismaToReward(reward: RewardModel): Reward {
    const { id, money, goal, documentId, progress, type } = reward;

    const found = RewardRepositoryPrisma.rewardTypeToClass.find(
      ([rewardType, _]) => rewardType === type,
    );
    if (!found) {
      throw new Error(`Unknown reward type: ${type}`);
    }
    const RewardClass = found[1];

    return new RewardClass(id, money, goal, documentId, progress);
  }

  private rewardToPrisma(userId: string, reward: Reward): RewardModel {
    return {
      id: reward.getId(),
      type: this.getType(reward),
      userId: userId,
      money: reward.getMoney(),
      goal: reward.getGoal(),
      fulfilled: reward.isFulfilled(),
      documentId: reward.getDocumentId(),
      progress: reward.getProgress(),
    };
  }

  private getType(reward: Reward): RewardType {
    const found = RewardRepositoryPrisma.rewardTypeToClass.find(
      ([_, RewardClass]) => reward instanceof RewardClass,
    );
    if (!found) {
      throw new Error(`Unknown reward class for reward ID: ${reward.getId()}`);
    }
    return found[0];
  }
}
