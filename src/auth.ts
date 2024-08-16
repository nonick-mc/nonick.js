import NextAuth, { type DefaultSession } from 'next-auth';
import discord from 'next-auth/providers/discord';
import 'next-auth/jwt';

// #region Config
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    discord({ authorization: 'https://discord.com/api/oauth2/authorize?scope=identify+guilds' }),
  ],
  callbacks: {
    jwt: ({ token, account, trigger }) => {
      if (trigger === 'signIn') {
        if (account?.access_token) token.access_token = account.access_token;
        if (account?.expires_at) token.expires_at = account.expires_at;
        if (account?.providerAccountId) token.user_id = account.providerAccountId;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.accessToken = token.access_token;
      session.user.expiresAt = token.expires_at;
      session.user.id = token.user_id;
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
      expiresAt: number;
      id: string;
      name: string;
      image: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    expires_at: number;
    user_id: string;
  }
}
// #endregion
