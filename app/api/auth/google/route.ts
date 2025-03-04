import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '@/lib/auth/google';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirect');

  if (redirectTo) {
    cookies().set('redirect', redirectTo, {
      maxAge: 60 * 10,
      path: '/',
    });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email'],
  });

  cookies().set('google-state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  cookies().set('google-code-verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  return Response.redirect(url);
}
