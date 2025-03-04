import {
  CompetitionRepository,
  UserRepository,
} from '@/lib/repositories/interfaces';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { repositories } from '@/lib/repositories/repositories';
import { randomElement } from '@/lib/random';
import {
  economicService,
  EconomicService,
} from '@/lib/services/economic-service';
import { computeRewardsFriends, REWARDS_GENERAL } from '@/common/competition';

export enum AddFriendResult {
  SUCCESS,
  ALREADY_FRIEND,
  FRIEND_CODE_NOT_FOUND,
  YOU_ARE_YOURSELF,
}

export class CompetitionService {
  private readonly competitionRepository: CompetitionRepository;
  private readonly userRepository: UserRepository;
  private readonly authProvider: AuthProvider;
  private readonly economicService: EconomicService;

  public static readonly NUMBER_OF_TOP_SCORES = 10;
  public static readonly FRIEND_CODE_LENGTH = 10;
  public static readonly FRIEND_CODE_CHARACTERS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

  constructor(
    competitionRepository: CompetitionRepository,
    userRepository: UserRepository,
    authProvider: AuthProvider,
    economicService: EconomicService,
  ) {
    this.competitionRepository = competitionRepository;
    this.userRepository = userRepository;
    this.authProvider = authProvider;
    this.economicService = economicService;
  }

  async getTopGeneralScores(): Promise<UserCompetitionDto[]> {
    const week = this.getCurrentWeek();

    return this.competitionRepository.getTopGeneralScores(
      week,
      CompetitionService.NUMBER_OF_TOP_SCORES,
    );
  }

  async getTopFriendScores(): Promise<UserCompetitionDto[]> {
    const week = this.getCurrentWeek();
    const userId = await this.authProvider.getUserId();

    return this.competitionRepository.getTopFriendScores(
      week,
      userId,
      CompetitionService.NUMBER_OF_TOP_SCORES,
    );
  }

  async finishCompetition(): Promise<void> {
    await this.finishGeneralCompetition();
    await this.finishFriendCompetition();
  }

  private async finishGeneralCompetition(): Promise<void> {
    const rewards = REWARDS_GENERAL;
    const currentWeek = this.getCurrentWeek();
    const topWithPrizes = await this.competitionRepository.getTopGeneralScores(
      currentWeek,
      rewards.length,
    );

    await Promise.all(
      topWithPrizes.map((score, index) => {
        this.economicService.addMoney(score.userId, rewards[index]);
      }),
    );
  }

  private async finishFriendCompetition(): Promise<void> {
    const week = this.getCurrentWeek();
    const users = await this.competitionRepository.getUsersWithFriends();

    await Promise.all(users.map((user) => this.addRewardUser(user, week)));
  }

  private async addRewardUser(
    user: { userId: string; numberOfFriends: number },
    week: string,
  ) {
    const rewards = computeRewardsFriends(user.numberOfFriends);

    const [selfScore, friendsScore] = await Promise.all([
      this.competitionRepository.getSelfScore(week, user.userId),
      this.competitionRepository.getTopFriendScores(
        week,
        user.userId,
        rewards.length,
      ),
    ]);

    if (!selfScore || selfScore.score === 0) {
      return;
    }

    const allScores = [...friendsScore, selfScore].sort(
      (a, b) => b.score - a.score,
    );

    const userIndex = allScores.findIndex(
      (score) => score.userId === user.userId,
    );

    if (userIndex >= rewards.length) {
      return;
    }

    const reward = rewards[userIndex];

    await this.economicService.addMoney(user.userId, reward);
  }

  async getSelfScore(): Promise<UserCompetitionDto> {
    const week = this.getCurrentWeek();
    const userId = await this.authProvider.getUserId();

    return (
      (await this.competitionRepository.getSelfScore(week, userId)) ||
      (await this.defaultScore(userId))
    );
  }

  async addFriend(friendCode: string): Promise<AddFriendResult> {
    const friendId =
      await this.competitionRepository.getFriendIdFromFriendCode(friendCode);

    if (!friendId) {
      return AddFriendResult.FRIEND_CODE_NOT_FOUND;
    }

    const userId = await this.authProvider.getUserId();

    if (userId === friendId) {
      return AddFriendResult.YOU_ARE_YOURSELF;
    }

    const isAlreadyFriend = await this.competitionRepository.isAlreadyFriend(
      userId,
      friendId,
    );

    if (isAlreadyFriend) {
      return AddFriendResult.ALREADY_FRIEND;
    }

    await this.competitionRepository.addUserToFriends(userId, friendId);

    return AddFriendResult.SUCCESS;
  }

  async removeFriend(friendId: string): Promise<void> {
    const userId = await this.authProvider.getUserId();

    await this.competitionRepository.removeUserFromFriends(userId, friendId);
  }

  async increaseScore(score: number): Promise<void> {
    const userId = await this.authProvider.getUserId();
    const week = this.getCurrentWeek();

    await this.competitionRepository.increaseScore(userId, week, score);
  }

  async getFriendCode(): Promise<string | null> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      return null;
    }

    const friendCode = await this.competitionRepository.getFriendCode(userId);

    if (friendCode) {
      return friendCode;
    }

    const newFriendCode = this.generateFriendCode();

    this.competitionRepository
      .setFriendCode(userId, newFriendCode)
      .catch(console.error);

    return newFriendCode;
  }

  public getCurrentWeek(): string {
    const currentDate = new Date();

    const { week, year } = this.getISOWeekNumberAndYear(currentDate);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  private getISOWeekNumberAndYear(date: Date): { week: number; year: number } {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);

    // Ajustar a la fecha más cercana al jueves
    const day = tempDate.getDay();
    const isoDay = day === 0 ? 7 : day; // Convertir Sunday=0 a 7
    tempDate.setDate(tempDate.getDate() + 4 - isoDay);

    const weekYear = tempDate.getFullYear();

    // Encontrar el primer jueves del año ISO
    const firstThursday = new Date(weekYear, 0, 4);
    const firstDay = firstThursday.getDay() || 7;
    firstThursday.setDate(firstThursday.getDate() + 4 - firstDay);

    // Calcular la diferencia en semanas
    const diff = tempDate.getTime() - firstThursday.getTime();
    let weekNumber = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;

    // Manejar casos de borde
    if (weekNumber < 1) {
      // Asignar a la última semana del año anterior
      const lastWeekPrevYear = this.getISOWeeksInYear(weekYear - 1);
      return { week: lastWeekPrevYear, year: weekYear - 1 };
    }

    const weeksInYear = this.getISOWeeksInYear(weekYear);
    if (weekNumber > weeksInYear) {
      // Asignar a la primera semana del siguiente año
      return { week: 1, year: weekYear + 1 };
    }

    return { week: weekNumber, year: weekYear };
  }

  private getISOWeeksInYear(year: number): number {
    const firstThursday = new Date(year, 0, 4);
    const day = firstThursday.getDay() || 7;
    firstThursday.setDate(firstThursday.getDate() + 4 - day);
    const lastThursday = new Date(year, 11, 28); // Último posible jueves ISO
    return Math.ceil(
      (lastThursday.getTime() - firstThursday.getTime()) /
        (7 * 24 * 60 * 60 * 1000) +
        1,
    );
  }

  public generateFriendCode(): string {
    let result = '';

    for (let i = 0; i < CompetitionService.FRIEND_CODE_LENGTH; i++) {
      result += randomElement(CompetitionService.FRIEND_CODE_CHARACTERS);
    }

    return result;
  }

  async defaultScore(userId: string): Promise<UserCompetitionDto> {
    const user = await this.userRepository.getUserById(userId);

    return {
      userId: userId,
      name: user.name,
      score: 0,
    };
  }
}

export const competitionService = new CompetitionService(
  repositories.competition,
  repositories.user,
  authProvider,
  economicService,
);
