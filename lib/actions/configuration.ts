'use server';

import { revalidatePath } from 'next/cache';
import { State } from '../interfaces';
import { getDictionaryInActions } from '@/lib/actions/utils';
import { configurationService } from '@/lib/services/configuration-service';
import { ConfigurationDto } from '../dto/configuration.dto';
import { authProvider } from '../providers/auth-provider';
import { cookies } from 'next/headers';
import {
  invitationService,
  InvitationService,
} from '../services/invitation-service';

/**
 * This function updates the configuration of the user.
 * @param _prevState previous state
 * @param formData config data
 */
export async function updateConfiguration(
  _prevState: State,
  formData: FormData,
) {
  const dictionary = getDictionaryInActions('configuration');

  const usesPomodoro = formData.get('usesPomodoro') as string;
  const minutesWork = parseInt(formData.get('minutesWork') as string);
  const minutesRest = parseInt(formData.get('minutesRest') as string);

  const userId = await authProvider.getUserId();

  const configurationGiven: ConfigurationDto = {
    userId: userId,
    usesPomodoro:
      typeof usesPomodoro === 'string' ? usesPomodoro === 'true' : undefined,
    minutesWork: minutesWork,
    minutesRest: minutesRest,
  };

  await configurationService.updateConfiguration(configurationGiven);

  revalidatePath('/app');
  return { isError: false, message: dictionary['configuration-updated'] };
}
