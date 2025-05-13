import 'server-only';

import {
  type APIGuild,
  type APIGuildChannel,
  type APIGuildMember,
  type APIRole,
  type APIUser,
  type GuildChannelType,
  PermissionFlagsBits,
  type RESTAPIPartialCurrentUserGuild,
} from 'discord-api-types/v10';
import { db } from '../drizzle';
import { DiscordEndPoints } from './constants';
import { discordBotUserFetch, discordOAuth2UserFetch } from './fetcher';
import { hasPermission } from './utils';

/** Botの招待URL */
export const inviteUrl = `${DiscordEndPoints.OAuth2}/authorize?${new URLSearchParams({
  client_id: process.env.AUTH_DISCORD_ID,
  scope: 'bot applications.commands',
  permissions: process.env.DISCORD_INVITE_PERMISSION,
  response_type: 'code',
  redirect_uri: process.env.AUTH_URL,
})}` as const;

/**
 * ユーザーが参加しているDiscordサーバーを取得
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link RESTAPIPartialCurrentUserGuild}に含まれるようになる
 * @see https://discord.com/developers/docs/resources/user#get-current-user-guilds
 */
export function getUserGuilds(withCounts = false) {
  return discordOAuth2UserFetch<RESTAPIPartialCurrentUserGuild[], false>(
    `/users/@me/guilds?with_counts=${withCounts}`,
    { throw: true },
  );
}

/**
 * Botとユーザーが参加しているDiscordサーバーを取得
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link RESTAPIPartialCurrentUserGuild}に含まれるようになる
 * @see {@link getUserGuilds}
 */
export async function getMutualGuilds(withCounts = false) {
  const userGuilds = await getUserGuilds(withCounts);
  const mutualGuilds = await db.query.guild.findMany({
    where: (guild, { inArray }) =>
      inArray(
        guild.id,
        userGuilds.map((v) => v.id),
      ),
  });
  const mutualGuildIds = mutualGuilds.map((guild) => guild.id);
  return userGuilds.filter((guild) => mutualGuildIds.includes(guild.id));
}

/**
 * ユーザーが`MANAGED_GUILD`権限を所有しており、かつBotとユーザーが参加しているDiscordサーバーを取得
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link RESTAPIPartialCurrentUserGuild}に含まれるようになる
 * @see {@link getMutualGuilds}
 */
export async function getMutualManagedGuilds(withCounts = false) {
  const mutualGuilds = await getMutualGuilds(withCounts);
  return mutualGuilds.filter((guild) =>
    hasPermission(guild.permissions, PermissionFlagsBits.ManageGuild),
  );
}

/**
 * Discordサーバーを取得
 * @param guildId サーバーID
 * @param withCounts `true`の場合、サーバーのおおよそのメンバー数が{@link APIGuild}に含まれるようになります
 * @see https://discord.com/developers/docs/resources/guild#get-guild
 */
export function getGuild(guildId: string, withCounts = false) {
  return discordBotUserFetch<APIGuild, false>(`/guilds/${guildId}?with_counts=${withCounts}`, {
    next: { revalidate: 30 },
    throw: true,
  });
}

/**
 * Discordサーバーのチャンネルを取得
 * @param guildId サーバーID
 * @see https://discord.com/developers/docs/resources/guild#get-guild-channels
 */
export function getChannels(guildId: string) {
  return discordBotUserFetch<APIGuildChannel<GuildChannelType>[], false>(
    `/guilds/${guildId}/channels`,
    { next: { revalidate: 30 }, throw: true },
  );
}

/**
 * Discordサーバーのロールを取得
 * @param guildId サーバーID
 * @see https://discord.com/developers/docs/resources/guild#get-guild-roles
 */
export function getRoles(guildId: string) {
  return discordBotUserFetch<APIRole[], false>(`/guilds/${guildId}/roles`, {
    throw: true,
  });
}

/**
 * Discordユーザーを取得
 * @param userId ユーザーID
 * @see https://discord.com/developers/docs/resources/user#get-user
 */
export function getUser(userId: string) {
  return discordBotUserFetch<APIUser, false>(`/users/${userId}`, {
    next: { tags: [`user-${userId}`] },
    throw: true,
  });
}

/**
 * Discordサーバーに参加しているメンバーを取得
 * @param guildId サーバーID
 * @param userId ユーザーID
 * @see https://discord.com/developers/docs/resources/guild#get-guild-member
 */
export function getGuildMember(guildId: string, userId: string) {
  return discordBotUserFetch<APIGuildMember, false>(`/guilds/${guildId}/members/${userId}`, {
    throw: true,
  });
}
