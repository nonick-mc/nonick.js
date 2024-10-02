import 'server-only';
import chalk from 'chalk';
import {
  type APIGuild,
  PermissionFlagsBits,
  type RESTAPIPartialCurrentUserGuild,
  type RESTRateLimit,
} from 'discord-api-types/v10';
import { Discord } from './constants';
import { Guild } from './database/models';
import { dbConnect } from './mongoose';
import { wait } from './utils';

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
          chalk.yellow.bold('[429]'),
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

/** 特定の権限が含まれているか確認 */
export function hasPermission(permissions: string, permission: bigint) {
  return (Number.parseInt(permissions) & Number(permission)) === Number(permission);
}
