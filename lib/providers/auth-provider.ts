import { UserRepository } from '@/lib/repositories/interfaces';
import { UserDto } from '@/lib/dto/user.dto';
import { repositories } from '@/lib/repositories/repositories';
import { getSession } from '@/lib/auth/auth';

export class AuthProvider {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get the user id of the current user
   * @returns The user id of the current user
   */
  async getUserId(): Promise<string | null> {
    const session = await getSession();

    return session?.userId;
  }

  /**
   * Get the user of the current session
   * @returns The user of the current session
   */
  async getUser(): Promise<UserDto | null> {
    const userId = await this.getUserId();

    if (!userId) {
      return null;
    }

    return await this.userRepository.getUserById(userId);
  }
}

export const authProvider = new AuthProvider(repositories.user);
