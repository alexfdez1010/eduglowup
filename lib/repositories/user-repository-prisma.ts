import { UserRepository } from '@/lib/repositories/interfaces';
import { UserDto, UserWithPasswordDto } from '@/lib/dto/user.dto';
import { PrismaClient } from '@prisma/client';
import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import { InvitationDto } from '../dto/invitation.dto';
import { PasswordRetrievalDto } from '@/lib/dto/password-retrieval.dto';
import { CodeOTPDto } from '../dto/otp.dto';
import { todayString } from '@/lib/utils/date';

export class UserRepositoryPrisma implements UserRepository {
  private client: PrismaClient;
  public static readonly invitationValidDays = 7;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async createOrUpdateCodeOTP(
    userId: string,
    code: number,
    timestamp: Date,
  ): Promise<void> {
    await this.client.codeOTP.upsert({
      where: {
        userId: userId,
      },
      update: {
        code: code,
        timestamp: timestamp,
      },
      create: {
        userId: userId,
        code: code,
        timestamp: timestamp,
      },
    });
  }

  async getCodeOTP(userId: string): Promise<CodeOTPDto | null> {
    const codeOTP = await this.client.codeOTP.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!codeOTP) {
      return null;
    }

    return {
      userId: userId,
      code: codeOTP.code,
      timestamp: codeOTP.timestamp,
    };
  }

  async removeCodeOTP(userId: string): Promise<void> {
    await this.client.codeOTP.delete({
      where: {
        userId: userId,
      },
    });
  }

  async getInvitationOfUser(userId: string): Promise<InvitationDto> {
    const user = await this.client.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        invitationToken: true,
        invitationCount: true,
        registrationStamp: true,
      },
    });

    return {
      userId: userId,
      invitationToken: user.invitationToken,
      invitationCount: user.invitationCount,
      validUntil: new Date(
        new Date().getTime() +
          1000 * 60 * 60 * 24 * UserRepositoryPrisma.invitationValidDays,
      ),
    };
  }

  async getInvitation(token: string): Promise<InvitationDto> {
    const user = await this.client.user.findFirst({
      where: {
        invitationToken: token,
      },
      select: {
        id: true,
        invitationCount: true,
        registrationStamp: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      invitationToken: token,
      invitationCount: user.invitationCount,
      validUntil: new Date(
        new Date().getTime() +
          1000 * 60 * 60 * 24 * UserRepositoryPrisma.invitationValidDays,
      ),
    };
  }

  async updateInvitation(invitation: InvitationDto): Promise<void> {
    await this.client.user.update({
      where: {
        id: invitation.userId,
      },
      data: {
        invitationToken: invitation.invitationToken,
        invitationCount: invitation.invitationCount,
      },
    });
  }

  async createUser(user: UserWithPasswordDto): Promise<string> {
    const { id } = await this.client.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        money: user.money,
        isVerified: user.isVerified,
      },
    });

    return id;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.user.delete({
      where: {
        id: id,
      },
    });
  }

  async getUserWithPasswordByEmail(
    email: string,
  ): Promise<UserWithPasswordDto> {
    const user = await this.client.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      money: user.money,
      password: user.password,
      isVerified: user.isVerified,
    };
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    const user = await this.client.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      money: user.money,
      isVerified: user.isVerified,
    };
  }

  async getUserWithPasswordById(
    id: string,
  ): Promise<UserWithPasswordDto | null> {
    const user = await this.client.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      money: user.money,
      password: user.password,
      isVerified: user.isVerified,
    };
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await this.client.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      money: user.money,
      isVerified: user.isVerified,
    };
  }

  async getNumberOfUsers(): Promise<number> {
    return await this.client.user.count();
  }

  async updateName(id: string, name: string): Promise<void> {
    await this.client.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.client.user.update({
      where: {
        id: id,
      },
      data: {
        password: password,
      },
    });
  }

  async verifyUser(id: string): Promise<void> {
    await this.client.user.update({
      where: {
        id: id,
      },
      data: {
        isVerified: true,
      },
    });
  }

  async createConfiguration(configuration: ConfigurationDto): Promise<void> {
    await this.client.configuration
      .create({
        data: {
          userId: configuration.userId,
        },
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async getConfiguration(userId: string): Promise<ConfigurationDto> {
    const configuration = await this.client.configuration.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!configuration) {
      return null;
    }

    return {
      userId: configuration.userId,
      usesPomodoro: configuration.usesPomodoro,
      minutesWork: configuration.minutesWork,
      minutesRest: configuration.minutesRest,
    };
  }

  async updateConfiguration(configuration: ConfigurationDto): Promise<void> {
    // Remove the undefined values
    const data = Object.fromEntries(
      Object.entries(configuration).filter(
        ([key, value]) =>
          (key !== 'userId' && value) || typeof value === 'boolean',
      ),
    );

    await this.client.configuration.update({
      where: {
        userId: configuration.userId,
      },
      data: data,
    });
  }

  async deleteConfiguration(userId: string): Promise<void> {
    await this.client.configuration.delete({
      where: {
        userId: userId,
      },
    });
  }

  async addMoney(userId: string, money: number): Promise<void> {
    await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        money: {
          increment: money,
        },
      },
    });
  }

  async chargeMoney(userId: string, money: number): Promise<void> {
    await this.client.user.update({
      where: {
        id: userId,
      },
      data: {
        money: {
          decrement: money,
        },
      },
    });
  }

  async createPasswordToken(userId: string, token: string): Promise<void> {
    const user = await this.client.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return;
    }

    await this.client.passwordRetrieval.create({
      data: {
        userId: user.id,
        token: token,
      },
    });
  }

  async getPasswordToken(token: string): Promise<PasswordRetrievalDto | null> {
    const passwordToken = await this.client.passwordRetrieval.findFirst({
      where: {
        token: token,
      },
    });

    if (passwordToken === null) {
      return null;
    }

    return {
      userId: passwordToken.userId,
      token: passwordToken.token,
      timestamp: passwordToken.timestamp,
    };
  }

  async deletePasswordToken(userId: string): Promise<boolean> {
    try {
      await this.client.passwordRetrieval.delete({
        where: {
          userId: userId,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async increaseUserTimeSpent(userId: string, minutes: number): Promise<void> {
    const today = todayString();

    await this.client.userStatistics.upsert({
      where: {
        userId_day: {
          userId: userId,
          day: today,
        },
      },
      update: {
        minutesOnApp: {
          increment: minutes,
        },
      },
      create: {
        userId: userId,
        day: today,
        minutesOnApp: minutes,
      },
    });
  }
}
