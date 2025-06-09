declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly DISCORD_TOKEN: string;
        readonly GUILD_ID?: string;
        readonly DATABASE_URL: string;
        readonly DEV_MODE?: boolean;
      }
    }
  }
}
