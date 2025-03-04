import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId?: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: 'session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  try {
    const session = await getIronSession<SessionData>(
      cookies(),
      sessionOptions,
    );

    if (!session.isLoggedIn) {
      session.isLoggedIn = defaultSession.isLoggedIn;
    }

    return session;
  } catch (error) {
    return null;
  }
}
