import {
  type APIGuildChannel,
  type APIRole,
  ChannelType,
  type GuildChannelType,
} from 'discord-api-types/v10';

/** 特定の権限が含まれていれば`true`を返す */
export function hasPermission(permissions: string, permission: bigint) {
  return (Number.parseInt(permissions) & Number(permission)) === Number(permission);
}

/** チャンネルをDiscord上の配置順に並べ替え */
export function sortChannels(channels: APIGuildChannel<GuildChannelType>[]) {
  const categories = channels.filter((channel) => channel.type === ChannelType.GuildCategory);
  const otherChannels = channels.filter((channel) => channel.type !== ChannelType.GuildCategory);

  categories.sort((a, b) => a.position - b.position);

  const sortedChannels: APIGuildChannel<GuildChannelType>[] = [];

  for (const category of categories) {
    sortedChannels.push(category);

    const childChannels = otherChannels.filter((channel) => channel.parent_id === category.id);
    const voiceChannels = childChannels.filter((channel) =>
      [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type),
    );
    const textChannels = childChannels.filter(
      (channel) => !voiceChannels.some((v) => v.id === channel.id),
    );

    voiceChannels.sort((a, b) => a.position - b.position);
    textChannels.sort((a, b) => a.position - b.position);

    sortedChannels.push(...textChannels, ...voiceChannels);
  }

  const rootChannels = otherChannels.filter((channel) => !channel.parent_id);
  const rootVoiceChannels = rootChannels.filter((channel) =>
    [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type),
  );
  const rootTextChannels = rootChannels.filter(
    (channel) => !rootVoiceChannels.some((v) => v.id === channel.id),
  );

  rootVoiceChannels.sort((a, b) => a.position - b.position);
  rootTextChannels.sort((a, b) => a.position - b.position);

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
