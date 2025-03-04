import {
  ProfileRepository,
  UserRepository,
} from '@/lib/repositories/interfaces';
import bcrypt from 'bcryptjs';
import { repositories } from '@/lib/repositories/repositories';
import { UserDto } from '@/lib/dto/user.dto';
import {
  GenerateRewardService,
  generateRewardService,
} from '@/lib/services/generate-reward-service';
import {
  resourceService,
  ResourceService,
} from '@/lib/services/resource-service';

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly generateRewardService: GenerateRewardService;
  private readonly resourceService: ResourceService;
  private readonly profileRepository: ProfileRepository;

  static readonly INITIAL_MONEY = 150;
  static readonly NUMBER_OR_ROUNDS_SALT = 10;

  constructor(
    userRepository: UserRepository,
    profileRepository: ProfileRepository,
    generateRewardService: GenerateRewardService,
    resourceService: ResourceService,
  ) {
    this.userRepository = userRepository;
    this.profileRepository = profileRepository;
    this.generateRewardService = generateRewardService;
    this.resourceService = resourceService;
  }

  /**
   * Check if the user with the given email already exists
   * @param email The email of the user
   * @returns True if the user exists, false otherwise
   */
  async isAlreadyRegistered(email: string): Promise<boolean> {
    return (await this.userRepository.getUserByEmail(email)) !== null;
  }

  /**
   * Get the user with the given email
   * @param email The email of the user
   * @returns The user with the given email, null if the user does not exist
   */
  async getUserByEmail(email: string): Promise<UserDto | null> {
    return await this.userRepository.getUserByEmail(email);
  }

  /**
   * Get the user with the given id
   * @param userId The id of the user
   * @returns The user with the given id, null if the user does not exist
   */
  async getUserById(userId: string): Promise<UserDto | null> {
    return await this.userRepository.getUserById(userId);
  }

  /**
   * Register a new user with the given email, name, password and isVerified
   * @param email The email of the user
   * @param name The name of the user
   * @param password The password of the user, if null indicates that the user has registered with Google Auth
   * @param isVerified Whether the user is verified or not
   *
   * @returns The id of the user
   */
  async registerUser(
    email: string,
    name: string,
    password: string | null,
    isVerified: boolean,
  ): Promise<string> {
    if (password) {
      password = await this.hashPassword(password);
    }

    const user = {
      email: email,
      name: name,
      password: password,
      money: UserService.INITIAL_MONEY,
      isVerified: isVerified,
    };

    const id = await this.userRepository.createUser(user);

    await Promise.all([
      this.userRepository.createConfiguration({
        userId: id,
        usesPomodoro: true,
        minutesWork: 25,
        minutesRest: 5,
      }),
      this.generateRewardService.createInitialRewards(id),
    ]);

    return id;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, UserService.NUMBER_OR_ROUNDS_SALT);
  }

  /**
   * Login the user with the given email and password
   * @param email The email of the user
   * @param password The password of the user
   * @returns The id of the user if the login is successful, null otherwise
   */
  async loginUser(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.getUserWithPasswordByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user.id;
  }

  /**
   * Update the password of the user with the given userId
   * @param userId The id of the user
   * @param oldPassword The old password of the user
   * @param newPassword The new password of the user
   * @returns True if the password was updated successfully, false otherwise
   */
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userRepository.getUserWithPasswordById(userId);

    if (!user) {
      return false;
    }

    const isPasswordCorrect =
      user.password === null ||
      (await bcrypt.compare(oldPassword, user.password));

    if (!isPasswordCorrect) {
      return false;
    }

    newPassword = await this.hashPassword(newPassword);

    await this.userRepository.updatePassword(userId, newPassword);

    return true;
  }

  async getImageOfUser(userId: string): Promise<string | null> {
    const url = await this.profileRepository.getImageOfUser(userId);

    if (!url) {
      return null;
    }

    return this.resourceService.getTemporaryUrl(url);
  }
}

export const userService = new UserService(
  repositories.user,
  repositories.profile,
  generateRewardService,
  resourceService,
);
