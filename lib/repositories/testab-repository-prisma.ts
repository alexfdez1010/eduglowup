import { TestABRepository } from '@/lib/repositories/interfaces';
import {
  ExperimentDto,
  UserAssignmentDto,
  UserAssignmentWithResultDto,
  VariantDto,
} from '../dto/experiment.dto';
import { PrismaClient } from '@prisma/client';

export class TestABRepositoryPrisma implements TestABRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getExperiments(): Promise<ExperimentDto[]> {
    const experiments = await this.client.experiment.findMany();
    return experiments.map((experiment) => {
      return {
        name: experiment.name,
        description: experiment.description,
        startDate: experiment.startDate,
        endDate: experiment.endDate,
        metric: experiment.metric,
      };
    });
  }

  async getVariantsOfExperiment(experimentName: string): Promise<VariantDto[]> {
    const variants = await this.client.variant.findMany({
      where: {
        experiment: {
          name: experimentName,
        },
      },
      include: {
        experiment: true,
      },
    });

    return variants.map((variant) => {
      return {
        name: variant.name,
        experimentName: variant.experiment.name,
        probability: variant.probability,
      };
    });
  }

  async getUserAssignment(
    userId: string,
    experimentName: string,
  ): Promise<UserAssignmentDto | null> {
    const userAssignment = await this.client.userAssignment.findFirst({
      where: {
        userId: userId,
        experiment: {
          name: experimentName,
        },
      },
      include: {
        variant: true,
        experiment: true,
      },
    });

    if (!userAssignment) {
      return null;
    }

    return {
      userId: userAssignment.userId,
      experimentName: userAssignment.experiment.name,
      variantName: userAssignment.variant.name,
    };
  }

  async getUserAssignmentId(
    userId: string,
    experimentName: string,
  ): Promise<string | null> {
    const userAssignment = await this.client.userAssignment.findFirst({
      where: {
        userId: userId,
        experiment: {
          name: experimentName,
        },
      },
      select: {
        id: true,
      },
    });

    if (!userAssignment) {
      return null;
    }

    return userAssignment.id;
  }

  async saveUserAssignment(userAssignment: UserAssignmentDto): Promise<void> {
    const variant = await this.client.variant.findFirst({
      where: {
        name: userAssignment.variantName,
      },
      include: {
        experiment: true,
      },
    });

    await this.client.userAssignment.create({
      data: {
        userId: userAssignment.userId,
        experimentId: variant.experiment.id,
        variantId: variant.id,
      },
    });
  }

  async updateResult(userAssignmentId: string, result: number): Promise<void> {
    await this.client.userAssignment.update({
      where: {
        id: userAssignmentId,
      },
      data: {
        result: result,
      },
    });
  }

  async getUserAssignmentsWithResult(
    experimentId: string,
  ): Promise<UserAssignmentWithResultDto[]> {
    const userAssignments = await this.client.userAssignment.findMany({
      where: {
        experimentId: experimentId,
      },
      include: {
        variant: true,
        experiment: true,
      },
    });

    return userAssignments.map((userAssignment) => {
      return {
        userId: userAssignment.userId,
        experimentName: userAssignment.experiment.name,
        variantName: userAssignment.variant.name,
        result: userAssignment.result,
      };
    });
  }
}
