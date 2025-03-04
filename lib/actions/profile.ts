'use server';

import { State } from '@/lib/interfaces';
import { z } from 'zod';
import { profileService } from '@/lib/services/profile-service';
import { authProvider } from '@/lib/providers/auth-provider';
import { ProfileDto } from '@/lib/dto/profile.dto';
import { isValidUrl, maxSizeInput } from '@/lib/utils/general';
import { getDictionaryInActions } from '@/lib/actions/utils';
import { revalidatePath } from 'next/cache';
import { UUID } from '@/lib/uuid';

export async function updateProfile(
  _prevState: State | undefined,
  formData: FormData,
) {
  const parsedFormData = z
    .object({
      description: z.string().optional().nullable(),
      linkedinUrl: z.string().optional().nullable(),
      anotherUrl: z.string().optional().nullable(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  const userId = await authProvider.getUserId();

  if (!parsedFormData.success) {
    return { isError: true, message: 'Invalid form data' };
  }

  const { description, linkedinUrl, anotherUrl } = parsedFormData.data;

  const dictionary = getDictionaryInActions('configuration');

  if (description && description.length > maxSizeInput('normal-description')) {
    return { isError: true, message: dictionary['description-too-long'] };
  }
  if (linkedinUrl && !isValidUrl(linkedinUrl)) {
    return { isError: true, message: dictionary['invalid-linkedin-url'] };
  }
  if (anotherUrl && !isValidUrl(anotherUrl)) {
    return { isError: true, message: dictionary['invalid-another-url'] };
  }

  const profile: ProfileDto = {
    id: UUID.generate(),
    userId: userId,
    description: description,
    linkedinUrl: linkedinUrl,
    anotherUrl: anotherUrl,
    imageUrl: '',
  };

  await profileService.updateProfile(profile);

  return { isError: false, message: dictionary['profile-updated'] };
}

export async function getProfile(id: string) {
  const profile: ProfileDto = await profileService.getProfile(id);

  if (!profile) {
    return { isError: true, message: 'Error getting profile' };
  } else {
    return { isError: false, message: 'Profile retrieved', profile: profile };
  }
}

export async function updateImageOfUser(_prevState: State, formData: FormData) {
  const parsedFormData = z
    .object({
      image: z.instanceof(File),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsedFormData.success) {
    throw new Error('Invalid form data');
  }
  const image = parsedFormData.data.image;

  const userId = await authProvider.getUserId();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  await profileService.updateProfile({
    id: UUID.generate(),
    userId: userId,
  });
  await profileService.updateImageOfUser(userId, image);

  const dictionary = getDictionaryInActions('configuration');

  revalidatePath('/app', 'layout');
  return { isError: false, message: dictionary['profile-image-updated'] };
}
