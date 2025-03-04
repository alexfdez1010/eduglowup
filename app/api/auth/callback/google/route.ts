import { cookies } from 'next/headers';
import { google } from '@/lib/auth/google';
import { getSession } from '@/lib/auth/auth';
import { userService } from '@/lib/services/user-service';
import { redeemInvitation } from '@/lib/actions/user';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const storedState = cookies().get('google-state')?.value ?? null;
  const storedCode = cookies().get('google-code-verifier')?.value ?? null;

  if (!code || !storedState || !storedCode || state !== storedState) {
    return new Response('Invalid request', { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCode);

    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const user = await response.json();

    const email = user.email;
    const name = user.given_name || user.name || '';

    const userStored = await userService.getUserByEmail(email);

    let id: string;

    if (!userStored) {
      id = await userService.registerUser(email, name, null, true);

      await redeemInvitation(user.id);
    } else {
      id = userStored.id;
    }

    const session = await getSession();

    session.isLoggedIn = true;
    session.userId = id;
    await session.save();

    cookies().delete('google-code-verifier');
    cookies().delete('google-state');

    const redirectTo = cookies().get('redirect')?.value;

    if (redirectTo) {
      cookies().delete('redirect');
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectTo,
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/app',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
