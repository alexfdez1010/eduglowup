import { PrismaClient } from '@prisma/client';
import { ProfileDto } from '@/lib/dto/profile.dto';
import { ProfileRepository } from '@/lib/repositories/interfaces';

export class ProfileRepositoryPrisma implements ProfileRepository {
  private readonly client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async updateProfile(profile: ProfileDto): Promise<void> {
    await this.client.profile.upsert({
      where: {
        userId: profile.userId,
      },
      update: {
        description: profile.description,
        linkedinUrl: profile.linkedinUrl,
        anotherUrl: profile.anotherUrl,
      },
      create: {
        id: profile.id,
        userId: profile.userId,
        description: profile.description,
        linkedinUrl: profile.linkedinUrl,
        anotherUrl: profile.anotherUrl,
      },
    });
  }

  async getProfile(id: string): Promise<ProfileDto | null> {
    return this.client.profile.findFirst({
      where: {
        id: id,
      },
    });
  }

  async getUserProfile(userId: string): Promise<ProfileDto | null> {
    return this.client.profile.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  async getUserProfileId(userId: string): Promise<string | null> {
    return this.client.profile
      .findFirst({
        where: {
          userId: userId,
        },
      })
      .then((profile) => profile?.id);
  }

  async updateImageOfUser(userId: string, imageUrl: string): Promise<void> {
    await this.client.profile.update({
      where: {
        userId: userId,
      },
      data: {
        imageUrl: imageUrl,
      },
    });
  }

  async getImageOfUser(userId: string): Promise<string | null> {
    const profile = await this.client.profile.findFirst({
      where: {
        userId: userId,
      },
    });

    return profile?.imageUrl;
  }
}
