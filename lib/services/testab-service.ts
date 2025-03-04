import { TestABRepository } from '@/lib/repositories/interfaces';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import {
  ExperimentDto,
  UserAssignmentDto,
  VariantDto,
} from '@/lib/dto/experiment.dto';
import { selectFromProbabilityDistribution } from '@/lib/random';
import { repositories } from '@/lib/repositories/repositories';

export class TestABService {
  private readonly testABRepository: TestABRepository;
  private readonly authProvider: AuthProvider;

  constructor(testABRepository: TestABRepository, authProvider: AuthProvider) {
    this.testABRepository = testABRepository;
    this.authProvider = authProvider;
  }

  async getExperiments(): Promise<ExperimentDto[]> {
    return this.testABRepository.getExperiments();
  }

  async getVariantsOfExperiment(experimentName: string): Promise<VariantDto[]> {
    return this.testABRepository.getVariantsOfExperiment(experimentName);
  }

  async getUserAssignment(experimentName: string): Promise<UserAssignmentDto> {
    const userId = await this.authProvider.getUserId();
    const userAssignment = await this.testABRepository.getUserAssignment(
      userId,
      experimentName,
    );

    if (userAssignment) {
      return userAssignment;
    }

    const variants = await this.getVariantsOfExperiment(experimentName);

    if (variants.length === 0) {
      return null;
    }

    const probabilities = variants.map((variant) => variant.probability);
    const variantIndex = selectFromProbabilityDistribution(probabilities);

    const userAssignmentDto: UserAssignmentDto = {
      userId: userId,
      experimentName: experimentName,
      variantName: variants[variantIndex].name,
    };

    this.testABRepository.saveUserAssignment(userAssignmentDto).catch((e) => {
      console.error(e);
    });

    return userAssignmentDto;
  }

  async updateResult(nameExperiment: string, result: number): Promise<void> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      throw new Error('You must be logged in to update the result');
    }

    const userAssignmentId = await this.testABRepository.getUserAssignmentId(
      userId,
      nameExperiment,
    );

    if (!userAssignmentId) {
      return;
    }

    this.testABRepository.updateResult(userAssignmentId, result).catch((e) => {
      console.error(e);
    });
  }
}

export const testABService = new TestABService(
  repositories.testAB,
  authProvider,
);
