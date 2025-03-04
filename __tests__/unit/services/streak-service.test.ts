import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StreakService } from '@/lib/services/streak-service';
import { StreakRepository } from '@/lib/repositories/interfaces';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { StatisticsGeneralService } from '@/lib/services/statistics-general-service';
import { fakeInt, fakeUuid } from '@/__tests__/unit/fake';
import {
  getDatesBetween,
  minusDays,
  todayString,
  weekAgoString,
} from '@/lib/utils/date';
import { GeneralStatisticsDtoMother } from '@/__tests__/unit/object-mothers';

describe('StreakService', () => {
  let streakService: StreakService;
  let streakRepositoryMock: StreakRepository;
  let statisticsGeneralServiceMock: StatisticsGeneralService;
  let authProviderMock: AuthProvider;

  const lastWeekDates = getDatesBetween(weekAgoString(), todayString());

  beforeEach(() => {
    streakRepositoryMock = {
      getStreak: vi.fn(),
      updateCreateStreak: vi.fn(),
    } as unknown as StreakRepository;

    statisticsGeneralServiceMock = {
      getLastWeekStudying: vi.fn(),
    } as unknown as StatisticsGeneralService;

    authProviderMock = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    streakService = new StreakService(
      streakRepositoryMock,
      statisticsGeneralServiceMock,
      authProviderMock,
    );

    vi.clearAllMocks();
  });

  describe('getStreak', () => {
    it('should return the initial streak if the user has not a streak', async () => {
      const userId = fakeUuid();

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(null);
      vi.spyOn(
        statisticsGeneralServiceMock,
        'getLastWeekStudying',
      ).mockResolvedValue(
        lastWeekDates.map((date) =>
          GeneralStatisticsDtoMother.create({
            date,
            totalConceptQuestions: 10,
          }),
        ),
      );

      const result = await streakService.getStreak();

      expect(result).toEqual({
        userId: userId,
        currentStreak: 0,
        longestStreak: 0,
        lastStreakDate: '',
        lastWeekStreak: [true, true, true, true, true, true, true],
      });

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
    });

    it('should return the streak if the user has a streak', async () => {
      const userId = fakeUuid();
      const streak = {
        userId: userId,
        currentStreak: 3,
        longestStreak: 10,
        lastStreakDate: todayString(),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(
        statisticsGeneralServiceMock,
        'getLastWeekStudying',
      ).mockResolvedValue(
        lastWeekDates.map((date) =>
          GeneralStatisticsDtoMother.create({
            date,
            totalConceptQuestions: 10,
          }),
        ),
      );

      const result = await streakService.getStreak();

      const expectedStreak = {
        ...streak,
        lastWeekStreak: [true, true, true, true, true, true, true],
      };

      expect(result).toEqual(expectedStreak);

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
    });

    it('should put the current streak to 0 if the last streak date is not today', async () => {
      const userId = fakeUuid();
      const streak = {
        userId: userId,
        currentStreak: 3,
        longestStreak: 10,
        lastStreakDate: minusDays(fakeInt(1, 100)),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(
        statisticsGeneralServiceMock,
        'getLastWeekStudying',
      ).mockResolvedValue(
        lastWeekDates.map((date) =>
          GeneralStatisticsDtoMother.create({
            date,
            totalConceptQuestions: 10,
          }),
        ),
      );

      const result = await streakService.getStreak();

      const expectedStreak = {
        ...streak,
        currentStreak: 0,
        lastWeekStreak: [true, true, true, true, true, true, true],
      };

      expect(result).toEqual(expectedStreak);

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
    });

    it('should last week streak works correctly', async () => {
      const userId = fakeUuid();
      const streak = {
        userId: userId,
        currentStreak: 3,
        longestStreak: 10,
        lastStreakDate: todayString(),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(
        statisticsGeneralServiceMock,
        'getLastWeekStudying',
      ).mockResolvedValue([
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[0],
          totalConceptQuestions: 10,
        }),
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[1],
          totalConceptQuestions: 0,
          totalQuizQuestions: 0,
          totalShortQuestions: 0,
          totalTrueFalseQuestions: 0,
          totalFlashcards: 0,
        }),
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[2],
          totalShortQuestions: 10,
        }),
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[3],
          totalShortQuestions: 10,
        }),
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[4],
          totalTrueFalseQuestions: 10,
        }),
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[5],
          totalConceptQuestions: 0,
          totalQuizQuestions: 0,
          totalShortQuestions: 0,
          totalTrueFalseQuestions: 0,
          totalFlashcards: 0,
        }),
        GeneralStatisticsDtoMother.create({
          date: lastWeekDates[6],
          totalConceptQuestions: 10,
          totalQuizQuestions: 10,
        }),
      ]);

      const result = await streakService.getStreak();

      const expectedStreak = {
        ...streak,
        lastWeekStreak: [true, false, true, true, true, false, true],
      };

      expect(result).toEqual(expectedStreak);

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateStreak', () => {
    it('should not update the streak if the last streak date is today', async () => {
      const userId = fakeUuid();
      const streak = {
        userId: userId,
        currentStreak: 3,
        longestStreak: 10,
        lastStreakDate: todayString(),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(streakRepositoryMock, 'updateCreateStreak').mockResolvedValue(
        undefined,
      );

      await streakService.updateStreak();

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
      expect(streakRepositoryMock.updateCreateStreak).not.toHaveBeenCalled();
    });

    it('should increase the streak if the last streak date is yesterday', async () => {
      const userId = fakeUuid();
      const streak = {
        userId: userId,
        currentStreak: 3,
        longestStreak: 10,
        lastStreakDate: minusDays(1),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(streakRepositoryMock, 'updateCreateStreak').mockResolvedValue(
        undefined,
      );

      await streakService.updateStreak();

      streak.currentStreak++;
      streak.lastStreakDate = todayString();

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
      expect(streakRepositoryMock.updateCreateStreak).toHaveBeenCalledWith(
        streak,
      );
    });

    it('should restart the streak if the last streak date is 2 or more days ago', async () => {
      const userId = fakeUuid();
      const streak = {
        userId: userId,
        currentStreak: 3,
        longestStreak: 10,
        lastStreakDate: minusDays(2),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(streakRepositoryMock, 'updateCreateStreak').mockResolvedValue(
        undefined,
      );

      await streakService.updateStreak();

      streak.currentStreak = 1;
      streak.lastStreakDate = todayString();

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
      expect(streakRepositoryMock.updateCreateStreak).toHaveBeenCalledWith(
        streak,
      );
    });

    it('should correctly update the max streak', async () => {
      const userId = fakeUuid();
      const streakLength = fakeInt(1, 10);

      const streak = {
        userId: userId,
        currentStreak: streakLength,
        longestStreak: streakLength,
        lastStreakDate: minusDays(1),
      };

      vi.spyOn(authProviderMock, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(streakRepositoryMock, 'getStreak').mockResolvedValue(streak);
      vi.spyOn(streakRepositoryMock, 'updateCreateStreak').mockResolvedValue(
        undefined,
      );

      await streakService.updateStreak();

      streak.currentStreak++;
      streak.longestStreak++;
      streak.lastStreakDate = todayString();

      expect(authProviderMock.getUserId).toHaveBeenCalledTimes(1);
      expect(streakRepositoryMock.getStreak).toHaveBeenCalledWith(userId);
      expect(streakRepositoryMock.updateCreateStreak).toHaveBeenCalledWith(
        streak,
      );
    });
  });
});
