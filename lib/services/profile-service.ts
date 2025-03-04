import { ProfileDto } from '@/lib/dto/profile.dto';
import { ProfileRepository } from '@/lib/repositories/interfaces';
import { repositories } from '@/lib/repositories/repositories';
import {
  resourceService,
  ResourceService,
} from '@/lib/services/resource-service';

export class ProfileService {
  private readonly profileRepository: ProfileRepository;
  private readonly resourceService: ResourceService;

  constructor(
    profileRepository: ProfileRepository,
    resourceService: ResourceService,
  ) {
    this.profileRepository = profileRepository;
    this.resourceService = resourceService;
  }

  async getProfile(id: string): Promise<ProfileDto | null> {
    const profile = await this.profileRepository.getProfile(id);

    if (!profile) {
      return null;
    }

    profile.imageUrl = await this.resourceService.getTemporaryUrl(
      profile.imageUrl,
    );

    return {
      id: profile.id,
      userId: profile.userId,
      description: profile.description,
      linkedinUrl: profile.linkedinUrl,
      anotherUrl: profile.anotherUrl,
      imageUrl: profile.imageUrl,
    };
  }

  async getUserProfile(userId: string): Promise<ProfileDto | null> {
    const profile = await this.profileRepository.getUserProfile(userId);

    if (!profile) {
      return null;
    }

    profile.imageUrl = await this.resourceService.getTemporaryUrl(
      profile?.imageUrl,
    );

    return {
      id: profile.id,
      userId: profile.userId,
      description: profile.description,
      linkedinUrl: profile.linkedinUrl,
      anotherUrl: profile.anotherUrl,
      imageUrl: profile.imageUrl,
    };
  }

  async updateProfile(profile: ProfileDto): Promise<void> {
    await this.profileRepository.updateProfile(profile);
  }

  async updateImageOfUser(userId: string, image: File): Promise<void> {
    const url = await this.resourceService.uploadFile(image);
    await this.profileRepository.updateImageOfUser(userId, url);
  }
}

export const profileService = new ProfileService(
  repositories.profile,
  resourceService,
);
