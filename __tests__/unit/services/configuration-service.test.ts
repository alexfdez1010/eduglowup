import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigurationService } from '@/lib/services/configuration-service';
import { AuthProvider } from '@/lib/providers/auth-provider';
import { UserRepository } from '@/lib/repositories/interfaces';
import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import { fakeArrayString, fakeInt, fakeName, fakeUuid } from '../fake';
import { ConfigurationMother } from '../object-mothers';

describe('ConfigurationService', () => {
  let configurationService: ConfigurationService;
  let userRepository: UserRepository;
  let authProvider: AuthProvider;

  beforeEach(() => {
    userRepository = {
      getConfiguration: vi.fn(),
      updateName: vi.fn(),
      createConfiguration: vi.fn(),
      updateConfiguration: vi.fn(),
    } as unknown as UserRepository;
    authProvider = {
      getUserId: vi.fn(),
    } as unknown as AuthProvider;

    configurationService = new ConfigurationService(
      userRepository,
      authProvider,
    );
  });

  describe('getConfiguration', () => {
    it('should return the configuration for the user', async () => {
      const userId = fakeUuid();
      const configuration: ConfigurationDto = ConfigurationMother.create({
        userId: userId,
      });

      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepository, 'getConfiguration').mockResolvedValue(
        configuration,
      );

      const result = await configurationService.getConfiguration();

      expect(result).toEqual(configuration);
      expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
      expect(userRepository.getConfiguration).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if configuration is not found', async () => {
      const userId = 'user1';

      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepository, 'getConfiguration').mockResolvedValue(null);

      await expect(configurationService.getConfiguration()).rejects.toThrow(
        'Configuration not found',
      );
      expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
      expect(userRepository.getConfiguration).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateConfiguration', () => {
    it('should update the configuration for the user', async () => {
      const userId = fakeUuid();
      const buddyId = fakeInt(0, 9);
      const preferences = fakeArrayString(1, 3);

      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepository, 'updateConfiguration').mockResolvedValue(
        undefined,
      );

      const configuration = {
        userId: userId,
        buddyId: buddyId,
        preferences: preferences,
      };

      await configurationService.updateConfiguration(configuration);

      expect(userRepository.updateConfiguration).toHaveBeenCalledWith({
        userId: userId,
        buddyId: buddyId,
        preferences: preferences,
      });
    });

    it('should update the configuration with undefined buddyId and preferences if not provided', async () => {
      const userId = fakeUuid();

      vi.spyOn(userRepository, 'updateConfiguration').mockResolvedValue(
        undefined,
      );

      const configuration = {
        userId: userId,
      };

      await configurationService.updateConfiguration(configuration);

      expect(userRepository.updateConfiguration).toHaveBeenCalledWith({
        userId: userId,
        buddyId: undefined,
        preferences: undefined,
      });
    });
  });

  describe('updateName', () => {
    it('should update the name of the user', async () => {
      const userId = fakeUuid();
      const name = fakeName();

      vi.spyOn(authProvider, 'getUserId').mockResolvedValue(userId);
      vi.spyOn(userRepository, 'updateName').mockResolvedValue(undefined);

      await configurationService.updateName(name);

      expect(authProvider.getUserId).toHaveBeenCalledTimes(1);
      expect(userRepository.updateName).toHaveBeenCalledWith(userId, name);
    });
  });
});
