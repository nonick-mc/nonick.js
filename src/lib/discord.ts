import 'server-only';

import { auth } from '@/auth';
import chalk from 'chalk';
import {
  type APIGuild,
  type APIGuildChannel,
  type APIGuildMember,
  type APIRole,
  ChannelType,
  type GuildChannelType,
  PermissionFlagsBits,
  type RESTAPIPartialCurrentUserGuild,
  type RESTRateLimit,
} from 'discord-api-types/v10';
import { Discord } from './constants';
import { Guild } from './database/models';
import { dbConnect } from './mongoose';
import { wait } from './utils';

// #region API

/** Discordサーバーのチャンネルを取得 */
export async function getChannels(guildId: string) {
  const res = await fetchWithDiscordRateLimit(
    `${Discord.Endpoints.API}/guilds/${guildId}/channels`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      cache: 'no-store',
    },
  );

  if (!res.ok) throw new Error(res.statusText);
  return sortChannels(await res.json<APIGuildChannel<GuildChannelType>[]>());
}

/** Discordサーバーのロールを取得 */
export async function getRoles(guildId: string) {
  const res = await fetchWithDiscordRateLimit(`${Discord.Endpoints.API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<APIRole[]>();
}

/** Discordサーバーに参加しているメンバーを取得 */
export async function getGuildMember(guildId: string, userId: string) {
  const res = await fetchWithDiscordRateLimit(
    `${Discord.Endpoints.API}/guilds/${guildId}/members/${userId}`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
      cache: 'no-store',
    },
  );

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<APIGuildMember>();
}

/** ユーザーが参加しているDiscordサーバーを取得 */
export async function getUserGuilds(accessToken: string) {
  const res = await fetchWithDiscordRateLimit(`${Discord.Endpoints.API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<RESTAPIPartialCurrentUserGuild[]>();
}

/** Botとユーザーが参加しているDiscordサーバーを取得 */
export async function getMutualGuilds(accessToken: string) {
  await dbConnect();

  const userGuilds = await getUserGuilds(accessToken);
  const mutualGuildIds = await Guild.find({
    guildId: { $in: userGuilds.map((guild) => guild.id) },
  }).then((guilds) => guilds.map((guild) => guild.guildId));

  return userGuilds.filter((guild) => mutualGuildIds.includes(guild.id));
}

/** Discordサーバーを取得 */
export async function getGuild(guildId: string, withCounts = false) {
  const res = await fetchWithDiscordRateLimit(
    `${Discord.Endpoints.API}/guilds/${guildId}?with_counts=${withCounts}`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    },
  );

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<APIGuild>();
}

/** ユーザーが`MANAGED_GUILD`権限を所持しており、Botとユーザーが参加しているDiscordサーバーを取得 */
export async function getMutualManagedGuilds(accessToken: string) {
  const mutualGuilds = await getMutualGuilds(accessToken);

  return mutualGuilds.filter((guild) =>
    hasPermission(guild.permissions, PermissionFlagsBits.ManageGuild),
  );
}

/** ダッシュボードのアクセス権限を持っているか確認 */
export async function hasAccessDashboardPermission(guildId: string) {
  try {
    await dbConnect();

    const session = await auth();
    const guild = await getGuild(guildId).catch();
    if (!session || !guild) return false;

    const [roles, member] = await Promise.all([
      getRoles(guildId),
      getGuildMember(guildId, session.user.id),
    ]);

    const isGuildOwner = guild.owner_id === session.user.id;
    const hasAdminRole = roles
      .filter((role) => member.roles.includes(role.id))
      .some((role) => hasPermission(role.permissions, PermissionFlagsBits.ManageGuild));

    return isGuildOwner || hasAdminRole;
  } catch (e) {
    return false;
  }
}

/** `fetch()` レート制限によりリクエストが拒否された場合、`retry_after`秒待機した後に再度リクエストを行う。 */
export async function fetchWithDiscordRateLimit(
  input: URL | RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 429) {
    const data = await res.json<RESTRateLimit>();
    const retryAfter = Math.ceil(data.retry_after);

    if (data.global) {
      throw new Error('Global rate limit exceeded');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        [
          chalk.yellow(chalk.bold('[429]')),
          chalk.white(`${retryAfter}秒後に再試行します...`),
          chalk.dim(`(${input.toString()})`),
        ].join(' '),
      );
    }

    await wait(retryAfter * 1000);
    return await fetchWithDiscordRateLimit(input, init);
  }

  return res;
}

// #endregion

// #region Utils

/** 特定の権限が含まれているか確認 */
export function hasPermission(permissions: string, permission: bigint) {
  return (Number.parseInt(permissions) & Number(permission)) === Number(permission);
}

/** チャンネルをDiscord上の配置順に並べ替え */
const sortChannels = (channels: APIGuildChannel<GuildChannelType>[]) => {
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
};

// #endregion
