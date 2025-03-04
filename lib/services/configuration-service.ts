import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { UserRepository } from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';

export class ConfigurationService {
  private userRepository: UserRepository;
  private authProvider: AuthProvider;

  constructor(userRepository: UserRepository, authProvider: AuthProvider) {
    this.authProvider = authProvider;
    this.userRepository = userRepository;
  }

  async getConfiguration(): Promise<ConfigurationDto> {
    const userId = await this.authProvider.getUserId();

    const configuration = await this.userRepository.getConfiguration(userId);

    if (!configuration) {
      throw new Error('Configuration not found');
    }

    return configuration;
  }

  async updateConfiguration(
    configurationGiven: ConfigurationDto,
  ): Promise<void> {
    await this.userRepository.updateConfiguration(configurationGiven);
  }

  async updateName(name: string): Promise<void> {
    const userId = await this.authProvider.getUserId();

    await this.userRepository.updateName(userId, name);
  }
}

export const configurationService = new ConfigurationService(
  repositories.user,
  authProvider,
);
