import 'server-only';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/drizzle';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  user: {
    additionalFields: {
      globalName: {
        type: 'string',
        required: false,
        defaultValue: null,
      },
      discordUserId: {
        type: 'string',
        required: true,
      },
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      scope: ['guilds'],
      overrideUserInfoOnSignIn: true,
      mapProfileToUser: (profile) => {
        return {
          name: profile.username,
          globalName: profile.global_name,
          discordUserId: profile.id,
        };
      },
    },
  },
});
