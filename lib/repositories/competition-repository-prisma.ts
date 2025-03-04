import { PrismaClient } from '@prisma/client';
import { CompetitionRepository } from '@/lib/repositories/interfaces';
import { MIN_NUMBER_OF_FRIENDS } from '@/common/competition';

export class CompetitionRepositoryPrisma implements CompetitionRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getTopGeneralScores(
    week: string,
    top: number,
  ): Promise<UserCompetitionDto[]> {
    const scores = await this.client.weekPerformance.findMany({
      where: {
        week: week,
      },
      orderBy: {
        score: 'desc',
      },
      take: top,
      select: {
        user: {
          select: {
            name: true,
          },
        },
        score: true,
        userId: true,
      },
    });

    return scores.map((score) => ({
      userId: score.userId,
      name: score.user.name,
      score: score.score,
    }));
  }

  async getTopFriendScores(
    week: string,
    userId: string,
    top: number,
  ): Promise<UserCompetitionDto[]> {
    const friends = await this.client.friend.findMany({
      where: {
        userId: userId,
      },
      select: {
        friendId: true,
        friend: {
          select: {
            name: true,
          },
        },
      },
    });

    const scores = await this.client.weekPerformance.findMany({
      where: {
        week: week,
        userId: {
          in: friends.map((friend) => friend.friendId),
        },
      },
      orderBy: {
        score: 'desc',
      },
      take: top,
      select: {
        score: true,
        userId: true,
      },
    });

    const friendsWithScores = scores.map((score) => ({
      userId: score.userId,
      name: friends.find((friend) => friend.friendId === score.userId)?.friend
        .name,
      score: score.score,
    }));

    if (scores.length === top) {
      return friendsWithScores;
    }

    const friendsWithoutScores = friends.filter(
      (friend) => !scores.find((score) => score.userId === friend.friendId),
    );

    const numberOfFriendsToAdd = friends.length - scores.length;

    const friendsToAdd = friendsWithoutScores
      .slice(0, numberOfFriendsToAdd)
      .map((friend) => ({
        userId: friend.friendId,
        name: friend.friend.name,
        score: 0,
      }));

    return [...friendsWithScores, ...friendsToAdd];
  }

  async getSelfScore(
    week: string,
    userId: string,
  ): Promise<UserCompetitionDto> {
    const score = await this.client.weekPerformance.findFirst({
      where: {
        userId: userId,
        week: week,
      },
      select: {
        score: true,
        userId: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!score) {
      return null;
    }

    return {
      userId: userId,
      name: score.user.name,
      score: score.score,
    };
  }

  async addUserToFriends(userId: string, friendId: string): Promise<void> {
    await this.client.friend.createMany({
      data: [
        {
          userId: userId,
          friendId: friendId,
        },
        {
          userId: friendId,
          friendId: userId,
        },
      ],
    });
  }

  async removeUserFromFriends(userId: string, friendId: string): Promise<void> {
    await Promise.all([
      this.client.friend.delete({
        where: {
          userId_friendId: {
            userId: userId,
            friendId: friendId,
          },
        },
      }),
      this.client.friend.delete({
        where: {
          userId_friendId: {
            userId: friendId,
            friendId: userId,
          },
        },
      }),
    ]);
  }

  async isAlreadyFriend(userId: string, friendId: string): Promise<boolean> {
    const friend = await this.client.friend.findFirst({
      where: {
        userId: userId,
        friendId: friendId,
      },
    });

    return !!friend;
  }

  async getFriendIdFromFriendCode(friendCode: string): Promise<string | null> {
    const friend = await this.client.user.findFirst({
      where: {
        friendCode: friendCode,
      },
    });

    return friend?.id || null;
  }

  async increaseScore(
    userId: string,
    week: string,
    score: number,
  ): Promise<void> {
    await this.client.weekPerformance.upsert({
      where: {
        week_userId: {
          week: week,
          userId: userId,
        },
      },
      update: {
        score: {
          increment: score,
        },
      },
      create: {
        userId: userId,
        week: week,
        score: score,
      },
    });
  }

  async getFriendCode(userId: string): Promise<string | null> {
    const friendCode = await this.client.user.findFirst({
      where: {
        id: userId,
      },
    });

    return friendCode?.friendCode || null;
  }

  async setFriendCode(userId: string, friendCode: string): Promise<void> {
    await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        friendCode,
      },
    });
  }

  async getUsersWithFriends(): Promise<
    { userId: string; numberOfFriends: number }[]
  > {
    const users = await this.client.friend.groupBy({
      by: ['userId'],
      _count: {
        userId: true,
      },
      having: {
        userId: {
          _count: {
            gte: MIN_NUMBER_OF_FRIENDS,
          },
        },
      },
    });

    return users.map((user) => ({
      userId: user.userId,
      numberOfFriends: user._count.userId || 0,
    }));
  }
}
