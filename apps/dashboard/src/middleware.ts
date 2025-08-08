import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // sessionが無効な場合はログイン画面にリダイレクト
  if (!sessionCookie) {
    const url = new URL('/login', request.url);
    if (request.nextUrl.pathname === '/') {
      url.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/guilds/:path*'],
};
