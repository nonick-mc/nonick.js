declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string;
    readonly AUTH_SECRET: string;
    readonly AUTH_URL: string;
    readonly AUTH_DISCORD_ID: string;
    readonly AUTH_DISCORD_SECRET: string;
    readonly DISCORD_INVITE_PERMISSION: string;
    readonly DISCORD_TOKEN: string;
    readonly NEXT_PUBLIC_TURNSTILE_SITE_KEY: string;
    readonly TURNSTILE_SECRETKEY: string;
  }
}
