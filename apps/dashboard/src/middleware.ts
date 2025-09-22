import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (request.nextUrl.pathname === '/') {
    const searchParams = request.nextUrl.searchParams;
    if (searchParams.toString()) {
      const guildId = searchParams.get('guild_id');
      if (guildId) return NextResponse.redirect(new URL(`/guilds/${guildId}`, request.url));
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/guilds/:path*'],
};
