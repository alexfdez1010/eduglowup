import { afterEach, describe, expect, it } from 'vitest';
import { clearAllData } from '@/__tests__/integration/database/utils';
import { UserWithPasswordDto } from '@/lib/dto/user.dto';
import { repositories } from '@/lib/repositories/repositories';

const userRepository = repositories.user;

describe('UserRepositoryPrisma', () => {
  afterEach(async () => {
    await clearAllData();
  });

  it('should create a user', async () => {
    const user: UserWithPasswordDto = {
      email: 'test@test.com',
      name: 'Test',
      password: 'test',
      money: 100,
      isVerified: false,
    };

    const userId = await userRepository.createUser(user);

    expect(userId).toBeTruthy();

    const userRetrieved = await userRepository.getUserById(userId);

    expect(userRetrieved).toBeTruthy();
    expect(userRetrieved?.email).toBe(user.email);
    expect(userRetrieved?.name).toBe(user.name);
    expect(userRetrieved?.money).toBe(user.money);
    expect(userRetrieved?.isVerified).toBe(user.isVerified);
  });
});
