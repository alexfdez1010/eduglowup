import {
  AddFriendResult,
  CompetitionService,
} from '@/lib/services/competition-service';
import { CompetitionRepository } from '@/lib/repositories/interfaces';
import { UserRepository } from '@/lib/repositories/interfaces';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeArray, fakeUuid } from '@/__tests__/unit/fake';
import {
  UserCompetitionDtoMother,
  UserMother,
} from '@/__tests__/unit/object-mothers';
import { EconomicService } from '@/lib/services/economic-service';
import { computeRewardsFriends, REWARDS_GENERAL } from '@/common/competition';

describe('CompetitionService', () => {
  let competitionService: CompetitionService;
  let competitionRepository: CompetitionRepository;
  let userRepository: UserRepository;
  let authProvider: AuthProvider;
  let economicService: EconomicService;

  beforeEach(() => {
    competitionRepository = {
      getTopGeneralScores: vi.fn(),
      getTopFriendScores: vi.fn(),
      getSelfScore: vi.fn(),
      addUserToFriends: vi.fn(),
      removeUserFromFriends: vi.fn(),
      increaseScore: vi.fn(),
      getFriendCode: vi.fn(),
      setFriendCode: vi.fn(),
      getFriendIdFromFriendCode: vi.fn(),
      isAlreadyFriend: vi.fn(),
      getUsersWithFriends: vi.fn(),
    } as unknown as CompetitionRepository;

    userRepository = {
      getUserById: vi.fn(),
    } as unknown as UserRepository;

    authProvider = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    economicService = {
      addMoney: vi.fn(),
    } as unknown as EconomicService;

    competitionService = new CompetitionService(
      competitionRepository,
      userRepository,
      authProvider,
      economicService,
    );
  });

  it('should get correctly the global scores', async () => {
    const scores = fakeArray(UserCompetitionDtoMother.create, 3, 10);

    vi.spyOn(competitionRepository, 'getTopGeneralScores').mockResolvedValue(
      scores,
    );

    const result = await competitionService.getTopGeneralScores();

    expect(competitionRepository.getTopGeneralScores).toHaveBeenCalledTimes(1);
    expect(result).toEqual(scores);
  });

  it('should get correctly the friend scores', async () => {
    const scores = fakeArray(UserCompetitionDtoMother.create, 3, 10);

    vi.spyOn(competitionRepository, 'getTopFriendScores').mockResolvedValue(
      scores,
    );

    const result = await competitionService.getTopFriendScores();

    expect(competitionRepository.getTopFriendScores).toHaveBeenCalledTimes(1);
    expect(result).toEqual(scores);
  });

  it('should get correctly the self score', async () => {
    const score = UserCompetitionDtoMother.create();

    vi.spyOn(competitionRepository, 'getSelfScore').mockResolvedValue(score);

    const result = await competitionService.getSelfScore();

    expect(competitionRepository.getSelfScore).toHaveBeenCalledTimes(1);
    expect(result).toEqual(score);
  });

  it('should get the default score if the user does not have a score', async () => {
    const userId = fakeUuid();
    const user = UserMother.create({ id: userId });

    vi.spyOn(competitionRepository, 'getSelfScore').mockResolvedValue(null);
    vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
    vi.spyOn(userRepository, 'getUserById').mockResolvedValue(user);

    const result = await competitionService.getSelfScore();

    expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    expect(result).toEqual({
      userId: userId,
      name: user.name,
      score: 0,
    });
  });

  describe('addFriend', () => {
    it('should be able to add a friend', async () => {
      const userId = fakeUuid();
      const friendId = fakeUuid();
      const friendCode = competitionService.generateFriendCode();

      vi.spyOn(
        competitionRepository,
        'getFriendIdFromFriendCode',
      ).mockResolvedValue(friendId);
      vi.spyOn(competitionRepository, 'addUserToFriends').mockResolvedValue(
        undefined,
      );
      vi.spyOn(competitionRepository, 'isAlreadyFriend').mockResolvedValue(
        false,
      );
      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

      const result = await competitionService.addFriend(friendCode);

      expect(result).toEqual(AddFriendResult.SUCCESS);
      expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
      expect(competitionRepository.addUserToFriends).toHaveBeenCalledWith(
        userId,
        friendId,
      );
    });

    it('should be able to work if the friend code does not exist', async () => {
      const friendCode = competitionService.generateFriendCode();

      vi.spyOn(
        competitionRepository,
        'getFriendIdFromFriendCode',
      ).mockResolvedValue(null);

      const result = await competitionService.addFriend(friendCode);

      expect(result).toEqual(AddFriendResult.FRIEND_CODE_NOT_FOUND);
      expect(
        competitionRepository.getFriendIdFromFriendCode,
      ).toHaveBeenCalledWith(friendCode);
      expect(competitionRepository.addUserToFriends).not.toHaveBeenCalled();
    });

    it('should be able to work if the user try to make a friend with himself', async () => {
      const userId = fakeUuid();
      const friendId = userId;

      vi.spyOn(
        competitionRepository,
        'getFriendIdFromFriendCode',
      ).mockResolvedValue(friendId);
      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

      const result = await competitionService.addFriend(friendId);

      expect(result).toEqual(AddFriendResult.YOU_ARE_YOURSELF);
      expect(
        competitionRepository.getFriendIdFromFriendCode,
      ).toHaveBeenCalledWith(friendId);
      expect(competitionRepository.addUserToFriends).not.toHaveBeenCalled();
    });

    it('should be able to work if the user try to make a friend with a friend', async () => {
      const userId = fakeUuid();
      const friendId = fakeUuid();

      vi.spyOn(
        competitionRepository,
        'getFriendIdFromFriendCode',
      ).mockResolvedValue(friendId);
      vi.spyOn(competitionRepository, 'isAlreadyFriend').mockResolvedValue(
        true,
      );
      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

      const result = await competitionService.addFriend(friendId);

      expect(result).toEqual(AddFriendResult.ALREADY_FRIEND);
      expect(
        competitionRepository.getFriendIdFromFriendCode,
      ).toHaveBeenCalledWith(friendId);
      expect(competitionRepository.addUserToFriends).not.toHaveBeenCalled();
    });
  });

  it('should be able to remove a friend', async () => {
    const userId = fakeUuid();
    const friendId = fakeUuid();

    vi.spyOn(competitionRepository, 'removeUserFromFriends').mockResolvedValue(
      undefined,
    );
    vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

    await competitionService.removeFriend(friendId);

    expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
    expect(competitionRepository.removeUserFromFriends).toHaveBeenCalledWith(
      userId,
      friendId,
    );
  });

  it('should be able to increase the score of a user', async () => {
    const userId = fakeUuid();
    const score = 10;
    const week = competitionService.getCurrentWeek();

    vi.spyOn(competitionRepository, 'increaseScore').mockResolvedValue(
      undefined,
    );
    vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

    await competitionService.increaseScore(score);

    expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
    expect(competitionRepository.increaseScore).toHaveBeenCalledWith(
      userId,
      week,
      score,
    );
  });

  it('should be able to get the friend code of a user', async () => {
    const userId = fakeUuid();
    const friendCode = competitionService.generateFriendCode();

    vi.spyOn(competitionRepository, 'getFriendCode').mockResolvedValue(
      friendCode,
    );
    vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);

    const result = await competitionService.getFriendCode();

    expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
    expect(competitionRepository.getFriendCode).toHaveBeenCalledWith(userId);
    expect(result).toEqual(friendCode);
  });

  it('should be able to generate a new friend code if one not exist already', async () => {
    const userId = fakeUuid();
    const friendCode = competitionService.generateFriendCode();

    vi.spyOn(competitionRepository, 'getFriendCode').mockResolvedValue(
      undefined,
    );
    vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
    vi.spyOn(competitionService, 'generateFriendCode').mockReturnValue(
      friendCode,
    );
    vi.spyOn(competitionRepository, 'setFriendCode').mockResolvedValue(
      undefined,
    );

    const result = await competitionService.getFriendCode();

    expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
    expect(competitionRepository.getFriendCode).toHaveBeenCalledWith(userId);
    expect(competitionRepository.setFriendCode).toHaveBeenCalledWith(
      userId,
      friendCode,
    );
    expect(result).toEqual(friendCode);
  });

  describe('finish competition should work correctly', async () => {
    it('should be able to finish the general competition correctly', async () => {
      const userIdFirst = fakeUuid();
      const userIdSecond = fakeUuid();
      const userIdThird = fakeUuid();

      vi.spyOn(competitionRepository, 'getTopGeneralScores').mockResolvedValue([
        UserCompetitionDtoMother.create({ score: 10, userId: userIdFirst }),
        UserCompetitionDtoMother.create({ score: 5, userId: userIdSecond }),
        UserCompetitionDtoMother.create({ score: 3, userId: userIdThird }),
        UserCompetitionDtoMother.create({ score: 2 }),
        UserCompetitionDtoMother.create({ score: 1 }),
      ]);
      vi.spyOn(economicService, 'addMoney').mockResolvedValue(undefined);

      vi.spyOn(competitionRepository, 'getUsersWithFriends').mockResolvedValue(
        [],
      );

      await competitionService.finishCompetition();

      expect(economicService.addMoney).toHaveBeenNthCalledWith(
        1,
        userIdFirst,
        REWARDS_GENERAL[0],
      );
      expect(economicService.addMoney).toHaveBeenNthCalledWith(
        2,
        userIdSecond,
        REWARDS_GENERAL[1],
      );
      expect(economicService.addMoney).toHaveBeenNthCalledWith(
        3,
        userIdThird,
        REWARDS_GENERAL[2],
      );
    });

    it('should be able to finish the friend competition correctly', async () => {
      const userId = fakeUuid();

      vi.spyOn(competitionRepository, 'getTopGeneralScores').mockResolvedValue(
        [],
      );
      vi.spyOn(competitionRepository, 'getTopFriendScores').mockResolvedValue([
        UserCompetitionDtoMother.create({ score: 10 }),
        UserCompetitionDtoMother.create({ score: 5 }),
        UserCompetitionDtoMother.create({ score: 3 }),
      ]);

      vi.spyOn(competitionRepository, 'getUsersWithFriends').mockResolvedValue([
        { userId: userId, numberOfFriends: 3 },
      ]);

      vi.spyOn(competitionRepository, 'getSelfScore').mockResolvedValue(
        UserCompetitionDtoMother.create({ score: 8, userId }),
      );

      vi.spyOn(economicService, 'addMoney').mockResolvedValue(undefined);

      await competitionService.finishCompetition();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(economicService.addMoney).toHaveBeenLastCalledWith(
        userId,
        computeRewardsFriends(3)[1],
      );
    });
  });

  describe('getCurrentWeek', () => {
    const testCases = [
      {
        date: '2023-01-04T12:00:00Z',
        expected: '2023-W01',
      },
      {
        date: '2023-12-31T12:00:00Z',
        expected: '2023-W52',
      },
      {
        date: '2024-01-01T12:00:00Z',
        expected: '2024-W01',
      },
      {
        date: '2024-02-29T12:00:00Z',
        expected: '2024-W09',
      },
      {
        date: '2024-12-31T12:00:00Z',
        expected: '2025-W01',
      },
      {
        date: '2025-01-01T12:00:00Z',
        expected: '2025-W01',
      },
      {
        date: '2025-01-05T12:00:00Z',
        expected: '2025-W01',
      },
    ];

    it.each(testCases)(
      'should return $expected for date $date',
      ({ date, expected }) => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(date));

        const currentWeek = competitionService.getCurrentWeek();

        expect(new Date(date).getTimezoneOffset()).toBe(0);

        expect(currentWeek).toBe(expected);

        vi.useRealTimers();
      },
    );
  });
});
