import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse, URLPattern } from 'next/server';
import { snowflakeRegex } from './lib/discord/constants';

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

    const error =
      request.nextUrl.searchParams.get('error') ??
      request.nextUrl.searchParams.get('error_description');

    if (error) {
      const url = request.nextUrl;
      url.searchParams.delete('error');
      url.searchParams.delete('error_description');
      return NextResponse.redirect(url);
    }
  }

  // 設定ページのURLが不正な場合はサーバー選択ページにリダイレクト
  if (request.nextUrl.pathname.startsWith('/guilds')) {
    const urlPattern = new URLPattern({ pathname: '/guilds/:guildId/:segment*' });
    const guildId = urlPattern.exec(request.nextUrl)?.pathname.groups.guildId;

    if (!guildId || !snowflakeRegex.test(guildId)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 認証ページのURLが不正な場合は404を表示
  if (request.nextUrl.pathname.startsWith('/verify/guilds')) {
    const urlPattern = new URLPattern({ pathname: '/verify/guilds/:guildId/:segment*' });
    const guildId = urlPattern.exec(request.nextUrl)?.pathname.groups.guildId;

    if (!guildId || !snowflakeRegex.test(guildId)) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/guilds/:path*', '/verify/guilds/:path*'],
};
