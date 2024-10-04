import NextAuth, { type DefaultSession } from 'next-auth';
import discord from 'next-auth/providers/discord';
import 'next-auth/jwt';
import { NextResponse, URLPattern } from 'next/server';
import { Snowflake } from './lib/database/zod/util';

// #region Config
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    discord({ authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds' }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      if (auth?.user && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }

      if (auth?.user && request.nextUrl.pathname.startsWith('/guilds')) {
        const match = new URLPattern({ pathname: '/guilds/:guildId/:segment*' }).exec(
          request.nextUrl,
        );
        const guildId = match?.pathname.groups.guildId;

        if (!Snowflake.safeParse(guildId).success) {
          return NextResponse.redirect(new URL('/', request.nextUrl));
        }
      }

      return !!auth?.user;
    },
    jwt: ({ token, account, trigger }) => {
      if (trigger === 'signIn') {
        if (account?.access_token) token.access_token = account.access_token;
        if (account?.expires_at) token.expires_at = account.expires_at;
        if (account?.providerAccountId) token.user_id = account.providerAccountId;
      }

      if (token.expires_at * 1000 < Date.now()) token.error = 'TOKEN_EXPIRED';

      return token;
    },
    session: ({ session, token }) => {
      session.user.accessToken = token.access_token;
      session.user.id = token.user_id;

      if (token.error) session.error = token.error;

      return session;
    },
  },
});
// #endregion

// #region Types
declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      id: string;
      name: string;
      image: string;
    } & DefaultSession['user'];
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    expires_at: number;
    user_id: string;
    error?: string;
  }
}
// #endregion
