import { UserRepository } from '@/lib/repositories/interfaces';
import { randomInt } from '@/lib/random';
import { repositories } from '@/lib/repositories/repositories';
import { emailProvider, EmailProvider } from '@/lib/providers/email-provider';
import { templateRender, TemplateRender } from '@/lib/email/template-render';

export class OtpService {
  private readonly userRepository: UserRepository;
  private readonly templateRender: TemplateRender;
  private readonly emailProvider: EmailProvider;

  public static readonly timeBetweenCodeOTP = 1000 * 30; // 30 seconds
  public static readonly validTimeToLive = 1000 * 60 * 20; // 20 minutes
  public static readonly lengthOTP = 6;

  constructor(
    userRepository: UserRepository,
    templateRender: TemplateRender,
    emailProvider: EmailProvider,
  ) {
    this.templateRender = templateRender;
    this.userRepository = userRepository;
    this.emailProvider = emailProvider;
  }

  /**
   * Send the otp code to the user by email if it hasn't been sent in the last 20 seconds
   * @returns true if the code was sent by email, false otherwise
   */
  async sendCodeOTPByEmail(userId: string): Promise<boolean> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      return false;
    }

    const codeOTP = await this.userRepository.getCodeOTP(user.id);

    if (
      codeOTP &&
      codeOTP.timestamp >
        new Date(new Date().getTime() - OtpService.timeBetweenCodeOTP)
    ) {
      return false;
    }

    const code = randomInt(0, 99999);
    const timestamp = new Date();

    this.userRepository
      .createOrUpdateCodeOTP(user.id, code, timestamp)
      .catch((e) => {
        console.error(e);
      });

    const codeToSend = code.toString().padStart(OtpService.lengthOTP, '0');

    this.sendEmail(user.email, codeToSend).catch((e) => console.error(e));

    return true;
  }

  async checkCodeOTP(userId: string, code: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const codeOTP = await this.userRepository.getCodeOTP(userId);

    if (
      !codeOTP ||
      codeOTP.timestamp <
        new Date(new Date().getTime() - OtpService.validTimeToLive)
    ) {
      return false;
    }

    const isValid = parseInt(code) === codeOTP.code;

    if (!isValid) {
      return false;
    }

    await Promise.all([
      this.userRepository.removeCodeOTP(userId),
      this.userRepository.verifyUser(userId),
    ]);

    return true;
  }

  private async sendEmail(email: string, code: string): Promise<void> {
    const { subject, html, plainText } =
      await this.templateRender.renderOTP(code);

    await this.emailProvider.sendEmail(email, subject, html, plainText);
  }
}

export const otpService = new OtpService(
  repositories.user,
  templateRender,
  emailProvider,
);
