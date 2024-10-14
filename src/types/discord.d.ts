import type { APIGuildChannel, GuildChannelType, ThreadChannelType } from 'discord-api-types/v10';

export type GuildChannelWithoutThread = APIGuildChannel<
  Exclude<GuildChannelType, ThreadChannelType>
>;
