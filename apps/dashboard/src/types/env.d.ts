declare namespace NodeJS {
  interface ProcessEnv {
    readonly BETTER_AUTH_SECRET: string;
    readonly BETTER_AUTH_URL: string;
    readonly DISCORD_CLIENT_ID: string;
    readonly DISCORD_CLIENT_SECRET: string;
    readonly DISCORD_TOKEN: string;
    readonly DISCORD_INVITE_PERMISSION: string;
    readonly DATABASE_URL: string;
  }
}
