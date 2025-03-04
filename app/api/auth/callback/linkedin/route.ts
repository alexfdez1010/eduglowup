import { linkedin } from '@/lib/auth/linkedin';
import { cookies } from 'next/headers';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const storedState = cookies().get('linkedin-state')?.value ?? null;

  if (!code || !storedState || returnedState !== storedState) {
    throw new Error('Invalid request');
  }

  try {
    const tokens = await linkedin.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken;

    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = await response.json();

    const publicProfileUrl = user.publicProfileUrl;

    return new Response(publicProfileUrl, { status: 200 });
  } catch (error) {
    throw new Error('Invalid request');
  }
}
