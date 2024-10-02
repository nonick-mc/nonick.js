import { NextResponse, URLPattern } from 'next/server';
import { auth } from './auth';
import { Snowflake } from './lib/database/zod/util';

const patterns = {
  dashboard: new URLPattern({ pathname: '/guilds/:guildId/:segment*' }),
};

export default auth((req) => {
  if (req.auth && req.nextUrl.pathname.startsWith('/guilds')) {
    const match = patterns.dashboard.exec(req.nextUrl);
    const guildId = match?.pathname.groups.guildId;

    if (!Snowflake.safeParse(guildId).success) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
