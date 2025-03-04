import { repositories } from '@/lib/repositories/repositories';
import { DashboardRepository } from '@/lib/repositories/interfaces';
import {
  ExperimentDto,
  ExperimentWithIdDto,
  VariantDto,
  VariantWithFullDataDto,
} from '@/lib/dto/experiment.dto';

export class DashboardService {
  private readonly dashboardRepository: DashboardRepository;

  constructor(dashboardRepository: DashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  /**
   *
   * */
  async createNewTestAB(
    test: ExperimentDto,
    variants: VariantDto[],
  ): Promise<boolean> {
    return (
      (await this.dashboardRepository.createTestAB(test, variants)) !== null
    );
  }

  async getAllTestsAB(): Promise<ExperimentWithIdDto[]> {
    return await this.dashboardRepository.getAllTestsAB();
  }

  async getVariantFullData(testId: string): Promise<VariantWithFullDataDto[]> {
    return await this.dashboardRepository.getVariantsFromExperimentFullData(
      testId,
    );
  }
}

export const dashboardService = new DashboardService(repositories.dashboard);
