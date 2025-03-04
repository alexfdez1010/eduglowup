import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EconomicService } from '@/lib/services/economic-service';
import { UserRepository } from '@/lib/repositories/interfaces';
import { fakeUuid } from '../fake';
import { UserMother } from '../object-mothers';

describe('EconomicService', () => {
  let economicService: EconomicService;
  let userRepositoryMock: UserRepository;

  beforeEach(() => {
    userRepositoryMock = {
      getUserById: vi.fn(),
      chargeMoney: vi.fn(),
      addMoney: vi.fn(),
    } as unknown as UserRepository;
    economicService = new EconomicService(userRepositoryMock);
  });

  describe('addMoney', () => {
    it('should add money to the user account', async () => {
      const userId = fakeUuid();
      const amount = 10;
      await economicService.addMoney(userId, amount);
      expect(userRepositoryMock.addMoney).toHaveBeenCalledWith(userId, amount);
    });
  });

  describe('getMoney', () => {
    it('should return the correct amount of money the user has', async () => {
      const userId = fakeUuid();
      const user = UserMother.create({ id: userId, money: 20 });
      vi.spyOn(userRepositoryMock, 'getUserById').mockResolvedValue(user);
      const result = await economicService.getMoney(userId);
      expect(result).toBe(20);
    });

    it('should return 0 if the user does not exist', async () => {
      const userId = fakeUuid();
      vi.spyOn(userRepositoryMock, 'getUserById').mockResolvedValue(null);
      const result = await economicService.getMoney(userId);
      expect(result).toBe(0);
    });
  });
});
