import 'server-only';

import {
  type APIGuild,
  type APIGuildChannel,
  type APIRole,
  type GuildChannelType,
  PermissionFlagsBits,
  type RESTAPIPartialCurrentUserGuild,
  type RESTGetCurrentUserGuildMemberResult,
} from 'discord-api-types/v10';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '../drizzle';
import { discordBotUserFetch, discordOAuth2UserFetch } from './fetch';
import { hasPermission } from './utils';

/** https://discord.com/developers/docs/resources/user#get-current-user-guilds */
export async function getCurrentUserGuilds(withCounts = false) {
  const res = await discordOAuth2UserFetch<RESTAPIPartialCurrentUserGuild[]>(
    `/users/@me/guilds?with_counts=${withCounts}`,
  );
  if (res.error) {
    if (res.error.status === 401) redirect('/login');
    throw new Error(res.error.message);
  }
  return res.data;
}

/** https://discord.com/developers/docs/resources/guild#get-guild */
export function getGuild(guildId: string, withCounts = false) {
  return discordBotUserFetch<APIGuild, false>(`/guilds/${guildId}?with_counts=${withCounts}`, {
    next: { revalidate: 60 },
    throw: true,
  });
}

/** https://discord.com/developers/docs/resources/guild#get-guild-channels */
export function getChannels(guildId: string) {
  return discordBotUserFetch<APIGuildChannel<GuildChannelType>[], false>(
    `/guilds/${guildId}/channels`,
    { next: { revalidate: 60 }, throw: true },
  );
}

/** https://discord.com/developers/docs/resources/guild#get-guild-roles */
export function getRoles(guildId: string) {
  return discordBotUserFetch<APIRole[], false>(`/guilds/${guildId}/roles`, {
    next: { revalidate: 60 },
    throw: true,
  });
}

/** https://discord.com/developers/docs/resources/guild#get-guild-member */
export function getGuildMember(guildId: string, userId: string) {
  return discordBotUserFetch<RESTGetCurrentUserGuildMemberResult, false>(
    `/guilds/${guildId}/members/${userId}`,
    {
      throw: true,
    },
  );
}

export const getMutualGuilds = cache(async (withCounts = false) => {
  const currentUserGuilds = await getCurrentUserGuilds(withCounts);
  const mutualBotGuilds = await db.query.guild.findMany({
    where: (guild, { inArray }) =>
      inArray(
        guild.id,
        currentUserGuilds.map((v) => v.id),
      ),
  });
  return currentUserGuilds.filter((guild) => mutualBotGuilds.some((v) => v.id === guild.id));
});

export const getMutualManagedGuilds = cache(async (withCounts = false) => {
  const mutualGuilds = await getMutualGuilds(withCounts);
  return mutualGuilds.filter((guild) =>
    hasPermission(guild.permissions, PermissionFlagsBits.ManageGuild),
  );
});

export const getGuildMemberPermissions = cache(async (guildId: string, userId: string) => {
  const [member, roles] = await Promise.all([getGuildMember(guildId, userId), getRoles(guildId)]);

  const currentMemberRoles = roles.filter(
    (role) => member.roles.includes(role.id) || role.id === guildId,
  );

  let permissions = BigInt(0);
  for (const role of currentMemberRoles) {
    permissions |= BigInt(role.permissions);
  }

  return permissions.toString();
});
