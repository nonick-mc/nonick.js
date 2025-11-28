declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        DISCORD_TOKEN?: string;
        GUILD_ID?: string;
        DATABASE_URL?: string;
      }
    }
  }
}
