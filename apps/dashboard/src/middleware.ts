import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // セッションが存在しない場合はログイン画面にリダイレクト
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    const pathname = request.nextUrl.pathname;
    const search = request.nextUrl.search;

    if (pathname !== '/' || search) {
      loginUrl.searchParams.set('next', pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/guilds/:path*'],
};
