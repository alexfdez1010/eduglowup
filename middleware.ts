import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/i18n-config';
import { getSession } from '@/lib/auth/auth';

const ifSignedNotAllowed = ['/sign-in', '/sign-up'];

function isProtectedRoute(pathname: string) {
  return (
    pathname.includes('/app') ||
    pathname.includes('/verification') ||
    pathname.includes('/dashboard')
  );
}

function notProtectedRouteOnApp(pathname: string) {
  return pathname.includes('/app/document');
}

export async function middleware(request: NextRequest) {
  const session = await getSession();

  const urlWithoutLocale = request.nextUrl.pathname.replace(/^\/[a-z]{2}/, '');

  if (
    !session.isLoggedIn &&
    isProtectedRoute(urlWithoutLocale) &&
    !notProtectedRouteOnApp(urlWithoutLocale)
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (session.isLoggedIn && ifSignedNotAllowed.includes(urlWithoutLocale)) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return i18nRouter(request, i18n);
}

export const config = {
  matcher: '/((?!api|static|proxy|.*\\..*|_next).*)',
};
