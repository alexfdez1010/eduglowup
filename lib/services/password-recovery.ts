import { UserRepository } from '@/lib/repositories/interfaces';
import { UserDto } from '@/lib/dto/user.dto';
import { emailProvider, EmailProvider } from '@/lib/providers/email-provider';
import { UUID } from '@/lib/uuid';
import { repositories } from '@/lib/repositories/repositories';

import bcrypt from 'bcryptjs';
import {
  translationProvider,
  TranslationProvider,
} from '@/lib/providers/translation-provider';

export class PasswordRecoveryService {
  private readonly userRepository: UserRepository;
  private readonly emailService: EmailProvider;
  private readonly translationProvider: TranslationProvider;

  public static readonly timeToLive = 1000 * 60 * 60 * 2; // 2 hours

  constructor(
    userRepository: UserRepository,
    emailService: EmailProvider,
    translationProvider: TranslationProvider,
  ) {
    this.emailService = emailService;
    this.userRepository = userRepository;
    this.translationProvider = translationProvider;
  }

  async getUserByPasswordToken(token: string): Promise<UserDto | null> {
    const passwordToken = await this.userRepository.getPasswordToken(token);

    if (passwordToken === null) {
      return null;
    }

    const limit = new Date(
      new Date().getTime() - PasswordRecoveryService.timeToLive,
    );

    if (passwordToken.timestamp < limit) {
      return null;
    }

    return await this.userRepository.getUserById(passwordToken.userId);
  }

  async createPasswordToken(email: string): Promise<boolean> {
    const passwordToken = UUID.generate();

    const dictionary =
      this.translationProvider.getDictionaryInServer('retrieve-password');

    const user = await this.userRepository.getUserWithPasswordByEmail(email);

    if (user === null || user.password === null) {
      return false;
    }

    await this.userRepository.deletePasswordToken(user.id);

    const link = `${process.env.DOMAIN}/retrieve-password/${passwordToken}`;

    await repositories.user.createPasswordToken(user.id, passwordToken);

    const header = dictionary['email-header'];
    const subject = dictionary['email-subject'];
    const message = dictionary['email-message'];
    const linkText = dictionary['email-link-text'];

    const htmlTemplate = `
      <h1>${header}</h1>
      <p>${message}</p>
      <a href="${link}">${linkText}</a>
    `;

    this.emailService.sendEmail(email, subject, htmlTemplate).catch((e) => {
      console.error(e);
    });

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.getUserByPasswordToken(token);

    if (user === null) {
      return false;
    }

    const roundsSalt = 10;
    const passwordHashed = await bcrypt.hash(newPassword, roundsSalt);

    Promise.all([
      this.userRepository.updatePassword(user.id, passwordHashed),
      this.userRepository.deletePasswordToken(user.id),
    ]).catch((e) => {
      console.error(e);
    });

    return true;
  }
}

export const passwordRecoveryService = new PasswordRecoveryService(
  repositories.user,
  emailProvider,
  translationProvider,
);
