import { UserRepository } from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';

export class EconomicService {
  private readonly repository: UserRepository;

  public static readonly COST_ASK = 1;
  public static readonly COST_EXTEND_SUMMARY = 1;
  public static readonly COST_EXERCISE = 2;
  public static readonly COST_UPLOAD_DOCUMENT = 5;
  public static readonly INCREASE_EXERCISE_IF_OWNS_CLASS = 1;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async addMoney(userId: string, amount: number): Promise<void> {
    await this.repository.addMoney(userId, amount);
  }

  async getMoney(userId: string): Promise<number> {
    const user = await this.repository.getUserById(userId);
    return user?.money || 0;
  }
}

export const economicService = new EconomicService(repositories.user);
