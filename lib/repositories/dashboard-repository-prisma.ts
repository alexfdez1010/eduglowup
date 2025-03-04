import { DashboardRepository } from '@/lib/repositories/interfaces';
import { PrismaClient } from '@prisma/client';
import { UserDto } from '@/lib/dto/user.dto';
import {
  ExperimentDto,
  ExperimentWithIdDto,
  VariantDto,
  VariantWithFullDataDto,
} from '@/lib/dto/experiment.dto';

type UserCountByDate = {
  date: string;
  userCount: number;
};

export class DashboardRepositoryPrisma implements DashboardRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getNumberOfSignUpsInCourses(): Promise<number> {
    const totalUsersWithAccess = await this.client.$queryRaw`
      SELECT COUNT(*) AS count
      FROM "_usersWithAccess";
    `;

    return parseInt(totalUsersWithAccess[0].count);
  }

  async getNumberOfCourses(): Promise<number> {
    return this.client.course.count();
  }

  async getRegistrationsByDay(day: Date): Promise<number> {
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    return this.client.user.count({
      where: {
        registrationStamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async getAllDailyRegistrations(): Promise<
    { date: string; userCount: number }[]
  > {
    const value: UserCountByDate[] = await this.client
      .$queryRaw`SELECT DATE_TRUNC('day', "registrationStamp") AS "date", COUNT(*) AS "userCount"
        FROM "User"
        GROUP BY DATE_TRUNC('day', "registrationStamp")
        ORDER BY "date" ASC;`;

    return value.map((item) => {
      return {
        date: new Date(item.date).toISOString().split('T')[0],
        userCount: Number(item.userCount),
      };
    });
  }

  async getPageOfUsers(page: number, pageSize: number): Promise<UserDto[]> {
    const users = await this.client.user.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        registrationStamp: 'desc',
      },
    });

    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        money: user.money,
        isVerified: user.isVerified,
      };
    });
  }

  async getPageOfUsersByEmail(
    page: number,
    pageSize: number,
    emailPattern: string,
  ): Promise<UserDto[]> {
    const users = await this.client.user.findMany({
      skip: page * pageSize,
      take: pageSize,
      where: {
        email: {
          contains: emailPattern,
        },
      },
      orderBy: {
        registrationStamp: 'desc',
      },
    });

    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        money: user.money,
        isVerified: user.isVerified,
      };
    });
  }

  async getAmountOfUsersByEmail(emailPattern: string): Promise<number> {
    return await this.client.user.count({
      where: {
        email: {
          contains: emailPattern,
        },
      },
    });
  }

  async getAverageUsageByDay(stringDay: string): Promise<number> {
    const value = await this.client.userStatistics.aggregate({
      _avg: {
        minutesOnApp: true,
      },
      where: {
        day: {
          equals: stringDay,
        },
      },
    });

    return value._avg.minutesOnApp ?? 0;
  }

  async getTotalTimeOfUsers(): Promise<number> {
    const value = await this.client.userStatistics.aggregate({
      _sum: {
        minutesOnApp: true,
      },
    });
    return value._sum.minutesOnApp
      ? Math.floor(value._sum.minutesOnApp / 60)
      : 0;
  }

  async getTotalNumberOfInvitations(): Promise<number> {
    const value = await this.client.user.aggregate({
      _sum: {
        invitationCount: true,
      },
    });
    return value._sum.invitationCount ?? 0;
  }

  async getNumberOfExercisesByType(): Promise<Record<string, number>> {
    const counts = await this.client.block.groupBy({
      by: ['type'],
      _count: {
        _all: true,
      },
    });

    return Object.fromEntries(
      counts.map((count) => {
        return [count.type.toString(), count._count._all];
      }),
    );
  }

  async getNumberOfDocuments(): Promise<number> {
    const count = await this.client.document.aggregate({
      _count: {
        _all: true,
      },
    });

    return count._count._all ?? 0;
  }

  async getNumberOfActiveUsers(currentWeek: string): Promise<number> {
    const count = await this.client.weekPerformance.aggregate({
      where: {
        week: currentWeek,
      },
      _count: {
        _all: true,
      },
    });

    return count._count._all ?? 0;
  }

  async getNumberOfFriends(): Promise<number> {
    const count = await this.client.friend.aggregate({
      _count: {
        _all: true,
      },
    });

    // We divide by 2 because when we add a friend we also add the other way around
    return (count._count._all ?? 0) / 2;
  }

  async createTestAB(test: ExperimentDto, variants: VariantDto[]) {
    try {
      const testAb = await this.client.experiment.create({
        data: {
          name: test.name,
          description: test.description,
          startDate: test.startDate,
          endDate: test.endDate,
          metric: test.metric,
        },
      });

      const variantsLength = variants.length;

      for (let i = 0; i < variantsLength; i++) {
        await this.client.variant.create({
          data: {
            name: variants[i].name,
            experimentId: testAb.id,
            probability: variants[i].probability,
          },
        });
      }
    } catch (error) {
      return false;
    }

    return true;
  }

  async getAllTestsAB(): Promise<ExperimentWithIdDto[]> {
    const tests = await this.client.experiment.findMany();
    return tests.map((test) => {
      return {
        id: test.id,
        name: test.name,
        description: test.description,
        startDate: test.startDate,
        endDate: test.endDate,
        metric: test.metric,
      };
    });
  }

  async getVariantsFromExperimentFullData(
    testId: string,
  ): Promise<VariantWithFullDataDto[]> {
    const experiment = await this.client.experiment.findUnique({
      where: {
        id: testId,
      },
    });

    const variants = await this.client.variant.findMany({
      where: {
        experimentId: testId,
      },
      include: {
        assignments: true,
      },
    });

    return variants.map((variant) => {
      return {
        name: variant.name,
        experimentName: experiment.name,
        probability: variant.probability,
        results: variant.assignments.reduce(
          (sum, item) => sum + (item.result || 0),
          0,
        ),
      };
    });
  }

  async getTotalExercises(): Promise<number> {
    const count = await this.client.block.aggregate({
      _count: {
        _all: true,
      },
    });

    return count._count._all ?? 0;
  }
}
