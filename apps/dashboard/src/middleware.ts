import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // セッションが存在しない場合はログイン画面にリダイレクト
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    if (request.nextUrl.pathname !== '/' || request.nextUrl.search) {
      loginUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
    }
    return NextResponse.redirect(loginUrl);
  }

  // サーバー選択ページのsearchParamsにguild_idがあれば、そのサーバーの設定ページにリダイレクト
  if (request.nextUrl.pathname === '/' && request.nextUrl.search) {
    const guildId = request.nextUrl.searchParams.get('guild_id');
    if (guildId) return NextResponse.redirect(new URL(`/guilds/${guildId}`, request.url));

    const error = request.nextUrl.searchParams.get('error');
    if (error) {
      const url = request.nextUrl;
      url.searchParams.delete('error');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/guilds/:path*'],
};
