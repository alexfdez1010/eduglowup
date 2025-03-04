'use server';

import ConfigButton from '@/components/configuration/ConfigButton';
import { authProvider } from '@/lib/providers/auth-provider';
import { repositories } from '@/lib/repositories/repositories';
import { invitationService } from '@/lib/services/invitation-service';
import { userService } from '@/lib/services/user-service';
import { profileService } from '@/lib/services/profile-service';
import { UserDto } from '@/lib/dto/user.dto';

/**
 * A wrapper for the ConfigButton component that fetches the user and configuration data from the server.
 */

export default async function ConfigButtonServerWrapper() {
  const user: UserDto = await authProvider.getUser();

  const profile = await profileService.getUserProfile(user.id);

  if (!user) {
    return null;
  }

  const [configuration, invitation, imageUrl] = await Promise.all([
    repositories.user.getConfiguration(user.id),
    invitationService.getInvitationOfUser(user.id),
    userService.getImageOfUser(user.id),
  ]);

  if (!configuration) {
    return null;
  }

  return (
    <ConfigButton
      configuration={configuration}
      invitation={invitation}
      user={user}
      profile={profile}
    />
  );
}
