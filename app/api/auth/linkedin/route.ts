import { linkedin } from '@/lib/auth/linkedin';
import { generateState, LinkedIn } from 'arctic';
import { cookies } from 'next/headers';

export async function GET(_req: Request) {
  const state = generateState();
  const scopes = ['openid', 'profile'];

  const url = await linkedin.createAuthorizationURL(state, {
    scopes,
  });

  cookies().set('linkedin-state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  return Response.redirect(url);
}
