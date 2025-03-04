'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

import { State } from '../interfaces';
import { getDictionaryInActions, urlWithLocale } from '@/lib/actions/utils';
import { repositories } from '@/lib/repositories/repositories';
import { revalidatePath } from 'next/cache';
import { configurationService } from '@/lib/services/configuration-service';
import { authProvider } from '@/lib/providers/auth-provider';
import { cookies } from 'next/headers';
import {
  invitationService,
  InvitationService,
} from '../services/invitation-service';
import { passwordRecoveryService } from '@/lib/services/password-recovery';
import { getSession } from '@/lib/auth/auth';
import { otpService } from '@/lib/services/otp-service';
import { translationProvider } from '@/lib/providers/translation-provider';
import { userService } from '@/lib/services/user-service';

export async function login(_prevState: State | undefined, formData: FormData) {
  const parsedFormData = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  const dictionary = getDictionaryInActions('sign-in');

  if (!parsedFormData.success) {
    return { isError: true, message: dictionary['error-credentials'] };
  }

  const { email, password } = parsedFormData.data;

  const userId = await userService.loginUser(email, password);

  if (!userId) {
    return { isError: true, message: dictionary['error-credentials'] };
  }

  const session = await getSession();

  session.isLoggedIn = true;
  session.userId = userId;

  await session.save();

  redirect(urlWithLocale('/app'));
}

export async function register(
  _prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const parsedFormData = z
    .object({
      email: z.string().email(),
      name: z.string().min(1).max(60),
      password: z.string().min(6),
      passwordConfirmation: z.string().min(6),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  const dictionary = getDictionaryInActions('sign-up');

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['error-data'],
    };
  }

  const { email, name, password, passwordConfirmation } = parsedFormData.data;

  if (password !== passwordConfirmation) {
    return { isError: true, message: dictionary['error-password'] };
  }

  // Check if the email is already in use
  const isAlreadyRegistered = await userService.isAlreadyRegistered(email);

  if (isAlreadyRegistered) {
    return { isError: true, message: dictionary['error-email'] };
  }

  const id = await userService.registerUser(email, name, password, false);

  const session = await getSession();

  session.isLoggedIn = true;
  session.userId = id;
  await session.save();

  await Promise.all([otpService.sendCodeOTPByEmail(id), redeemInvitation(id)]);

  redirect(urlWithLocale('/verification'));
}

export async function updateName(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsedFormData = z
    .object({
      name: z.string().min(1).max(60),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  const dictionary = getDictionaryInActions('configuration');

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['error-name'],
    };
  }

  const { name } = parsedFormData.data;

  await configurationService.updateName(name);
  revalidatePath('/app');

  return { isError: false, message: dictionary['name-updated'] };
}

export async function updatePassword(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsedFormData = z
    .object({
      oldPassword: z.string(),
      newPassword: z.string().min(6),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  const dictionary = translationProvider.getDictionaryInServer('configuration');

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['error-password'],
    };
  }

  const userId = await authProvider.getUserId();

  const { oldPassword, newPassword } = parsedFormData.data;

  const updatedPassword = await userService.updatePassword(
    userId,
    oldPassword,
    newPassword,
  );

  if (!updatedPassword) {
    return { isError: true, message: dictionary['error-password-old'] };
  }

  revalidatePath('/app');

  return { isError: false, message: dictionary['password-updated'] };
}

export async function signOutUser(
  _prevState: State,
  _formData: FormData,
): Promise<State> {
  const session = await getSession();

  session.destroy();
  revalidatePath('/app');
  redirect(urlWithLocale('/sign-in'));
}

export async function setInvitationCookie(formData: FormData) {
  const token = formData.get('token') as string;

  const userId = await authProvider.getUserId();

  if (userId) {
    redirect(urlWithLocale('app'));
  }

  cookies().set(InvitationService.invitationCookie, token);
  redirect(urlWithLocale('/sign-up'));
}

export async function askPasswordResetEmail(
  _prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const parsedFormData = z
    .object({
      email: z.string().email(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsedFormData.success) {
    throw new Error('Invalid form data');
  }

  const { email } = parsedFormData.data;

  const userExists = await passwordRecoveryService.createPasswordToken(email);

  const dictionary =
    translationProvider.getDictionaryInServer('retrieve-password');

  if (!userExists) {
    return {
      isError: true,
      message: dictionary['error-user-not-exists'],
    };
  } else {
    return {
      isError: false,
      message: dictionary['email-sent'],
    };
  }
}

export async function resetPassword(
  _prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('retrieve-password');

  const parsedFormData = z
    .object({
      token: z.string().uuid(),
      newPassword: z.string().min(6),
      newPasswordConfirmation: z.string().min(6),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['not-enough-strong-password'],
    };
  }

  const { token, newPassword, newPasswordConfirmation } = parsedFormData.data;

  if (newPassword !== newPasswordConfirmation) {
    return {
      isError: true,
      message: dictionary['error-password-mismatch'],
    };
  }

  const changed = await passwordRecoveryService.resetPassword(
    token,
    newPassword,
  );

  if (!changed) {
    return {
      isError: true,
      message: dictionary['error-user-not-exists'],
    };
  }

  redirect('/sign-in');
}

// Internal action, used to update the money of the user (Dashboard rewards)
export async function updateMoney(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const dictionary = getDictionaryInActions('dashboard');

  const parsedFormData = z
    .object({
      userId: z.string().uuid(),
      money: z.string().min(0),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  if (!parsedFormData.success) {
    return {
      isError: true,
      message: dictionary['error-rewards'],
    };
  }

  const { userId, money } = parsedFormData.data;

  try {
    await repositories.user.addMoney(userId, parseInt(money));
  } catch (error) {
    console.error(error);
    return { isError: true, message: dictionary['error-money-updated'] };
  }

  return { isError: false, message: dictionary['success-money-updated'] };
}

export async function redeemInvitation(userId: string) {
  const token = cookies().get(InvitationService.invitationCookie)?.value;

  if (!token) {
    return;
  }

  await invitationService.redeemInvitation(token, userId);

  cookies().delete(InvitationService.invitationCookie);
}

export async function getUserById(userId: string) {
  return await userService.getUserById(userId);
}

/**
 * This function is added to retrieve from client components the user id if needed.
 * */
export async function getUserId() {
  return await authProvider.getUserId();
}
