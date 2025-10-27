export enum DiscordEndPoints {
  API = 'https://discord.com/api/v10',
  CDN = 'https://cdn.discordapp.com',
  OAuth2 = 'https://discord.com/oauth2',
}

export const inviteBotUrl = `${DiscordEndPoints.OAuth2}/authorize?${new URLSearchParams({
  client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
  scope: 'bot applications.commands',
  permissions: process.env.NEXT_PUBLIC_DISCORD_INVITE_PERMISSION as string,
  response_type: 'code',
  redirect_uri: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
})}` as const;

export const snowflakeRegex = /^\d{17,19}$/;
