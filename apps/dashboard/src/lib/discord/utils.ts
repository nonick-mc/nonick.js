import {
  type APIGuildCategoryChannel,
  type APIGuildChannel,
  type APIGuildStageVoiceChannel,
  type APIGuildVoiceChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';

function getChannelPosition(channel: APIGuildChannel<GuildChannelType>) {
  return 'position' in channel && typeof channel.position === 'number' ? channel.position : 0;
}

/** 特定の権限が含まれていれば`true`を返す */
export function hasPermission(permissions: string, permission: bigint) {
  return (BigInt(permissions) & permission) === permission;
}

/** チャンネルをDiscord上の配置順に並べ替え */
export function sortChannels(channels: APIGuildChannel[]) {
  const categories = channels.filter(
    (channel) => channel.type === ChannelType.GuildCategory,
  ) as APIGuildCategoryChannel[];
  const otherChannels = channels.filter((channel) => channel.type !== ChannelType.GuildCategory);

  categories.sort((a, b) => a.position - b.position);

  const sortedChannels: APIGuildChannel[] = [];

  for (const category of categories) {
    sortedChannels.push(category);

    const childChannels = otherChannels.filter((channel) => channel.parent_id === category.id);
    const voiceChannels = childChannels.filter((channel) =>
      [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type),
    ) as APIGuildVoiceChannel[] | APIGuildStageVoiceChannel[];
    const textChannels = childChannels.filter(
      (channel) => !voiceChannels.some((v) => v.id === channel.id),
    );

    voiceChannels.sort((a, b) => a.position - b.position);
    textChannels.sort((a, b) => getChannelPosition(a) - getChannelPosition(b));

    sortedChannels.push(...textChannels, ...voiceChannels);
  }

  const rootChannels = otherChannels.filter((channel) => !channel.parent_id);
  const rootVoiceChannels = rootChannels.filter((channel) =>
    [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type),
  );
  const rootTextChannels = rootChannels.filter(
    (channel) => !rootVoiceChannels.some((v) => v.id === channel.id),
  );

  rootVoiceChannels.sort((a, b) => getChannelPosition(a) - getChannelPosition(b));
  rootTextChannels.sort((a, b) => getChannelPosition(a) - getChannelPosition(b));

  sortedChannels.unshift(...rootTextChannels, ...rootVoiceChannels);
  return sortedChannels;
}

/** ロールを`position`順に並べ替え */
export function sortRoles(roles: APIRole[]) {
  return roles.sort((a, b) => b.position - a.position);
}

/** 配列からチャンネルまたはロールに存在するIDのみを返す */
export function filterValidIds(
  ids: string[] | undefined,
  channelOrRoles: APIGuildChannel<GuildChannelType>[] | APIRole[],
) {
  return ids?.filter((id) => channelOrRoles.some((item) => item.id === id)) ?? [];
}
