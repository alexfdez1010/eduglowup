'use server';

import { State } from '@/lib/interfaces';
import {
  AddFriendResult,
  competitionService,
} from '@/lib/services/competition-service';
import { guardService } from '@/lib/services/guard-service';
import { getDictionaryInActions, urlWithLocale } from '@/lib/actions/utils';
import { revalidatePath } from 'next/cache';

export async function addFriend(_state: State, formData: FormData) {
  const friendCode = formData.get('friendCode') as string;

  const isLoggedIn = await guardService.isLoggedIn();

  if (!isLoggedIn) {
    throw new Error('You must be logged in to add a friend');
  }

  const dictionary = getDictionaryInActions('competition');

  const result = await competitionService.addFriend(friendCode);

  if (result === AddFriendResult.YOU_ARE_YOURSELF) {
    return {
      isError: true,
      message: dictionary['you-are-yourself'],
    };
  }

  if (result === AddFriendResult.ALREADY_FRIEND) {
    return {
      isError: true,
      message: dictionary['already-friend'],
    };
  }

  if (result === AddFriendResult.FRIEND_CODE_NOT_FOUND) {
    return {
      isError: true,
      message: dictionary['friend-code-not-found'],
    };
  }

  revalidatePath(urlWithLocale('/app/competition'));

  return {
    isError: false,
    message: dictionary['added-friend'],
  };
}
