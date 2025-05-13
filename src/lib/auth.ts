import 'server-only';

import type {
  RESTGetAPIOAuth2CurrentAuthorizationResult,
  RESTPostOAuth2AccessTokenResult,
} from 'discord-api-types/v10';
import NextAuth, { type DefaultSession } from 'next-auth';
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import type { JWT } from 'next-auth/jwt';
import discord, { type DiscordProfile } from 'next-auth/providers/discord';
import { revalidateTag } from 'next/cache';
import { NextResponse, URLPattern } from 'next/server';
import { snowflake } from './database/src/utils/zod/discord';
import { discordFetch } from './discord/fetcher';

type SessionError = 'RefreshTokenError' | 'AccessTokenError';

declare module 'next-auth' {
  interface User {
    username: string;
    discriminator: string;
  }
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      name: string;
      image: string;
      accessToken: string;
    };
    error?: SessionError;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // user
    userId: string;
    username: string;
    discriminator: string;

    // accounts
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: SessionError;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    discord({
      authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds',
      profile: (profile: DiscordProfile) => {
        if (profile.avatar === null) {
          const defaultAvatarNumber =
            profile.discriminator === '0'
              ? Number(BigInt(profile.id) >> BigInt(22)) % 6
              : Number.parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png';
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }
        return {
          id: profile.id,
          image: profile.image_url,
          name: profile.global_name ?? profile.username,
          username: profile.username,
          discriminator: profile.discriminator,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      const baseUrl = request.nextUrl.origin;

      if (auth && request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/', baseUrl));
      }

      if (auth && request.nextUrl.pathname === '/') {
        const searchParams = request.nextUrl.searchParams;
        if (searchParams.toString()) {
          const guildId = searchParams.get('guild_id');
          if (guildId) return NextResponse.redirect(new URL(`/guilds/${guildId}`, baseUrl));
          return NextResponse.redirect(new URL('/', baseUrl));
        }
      }

      if (auth?.user && request.nextUrl.pathname.startsWith('/guilds')) {
        const urlPattern = new URLPattern({ pathname: '/guilds/:guildId/:segment*' });
        const guildId = urlPattern.exec(request.nextUrl)?.pathname.groups.guildId;

        if (!snowflake.safeParse(guildId).success) {
          return NextResponse.redirect(new URL('/', baseUrl));
        }
      }

      return !!auth;
    },
    jwt: async ({ token, account, user }) => {
      // ログイン時にDiscordの認証情報をjwtトークンに追加する
      if (account && user) {
        revalidateTag(`user-${account.providerAccountId}`);
        token.userId = account.providerAccountId;
        token.username = user.username;
        token.discriminator = user.discriminator;
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token as string;
        token.expiresAt = account.expires_at as number;
        return token;
      }

      const isAccessTokenExpired = Date.now() > token.expiresAt * 1000;

      // アクセストークンが期限切れでない場合は、アクセストークンが現在も有効であるか検証する
      if (!isAccessTokenExpired && token.error !== 'AccessTokenError') {
        const { error } = await discordFetch<RESTGetAPIOAuth2CurrentAuthorizationResult>(
          '/oauth2/@me',
          {
            auth: {
              type: 'Bearer',
              token: token.accessToken,
            },
          },
        );
        if (error) token.error = 'AccessTokenError';
        return token;
      }

      // アクセストークンが期限切れの場合は、リフレッシュトークンを使用してアクセストークンを更新する
      if (isAccessTokenExpired && token.error !== 'RefreshTokenError') {
        const { data, error } = await discordFetch<RESTPostOAuth2AccessTokenResult>(
          '/oauth2/token',
          {
            method: 'POST',
            body: new URLSearchParams({
              client_id: process.env.AUTH_DISCORD_ID,
              client_secret: process.env.AUTH_DISCORD_SECRET,
              grant_type: 'refresh_token',
              refresh_token: token.refreshToken,
            }),
            next: { revalidate: 1 },
          },
        );

        if (error) {
          token.error = 'RefreshTokenError';
          return token;
        }

        token.accessToken = data.access_token;
        token.refreshToken = data.refresh_token;
        token.expiresAt = Math.floor(Date.now() / 1000 + data.expires_in);
        return token;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.username = token.username;
      session.user.discriminator = token.discriminator;
      session.user.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
});
