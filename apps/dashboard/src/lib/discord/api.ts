import 'server-only';

import { PermissionFlagsBits, type RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { redirect } from 'next/navigation';
import { db } from '../drizzle';
import { discordOAuth2UserFetch } from './fetch';
import { hasPermission } from './utils';

export async function getUserGuilds(withCounts = false) {
  const res = await discordOAuth2UserFetch<RESTAPIPartialCurrentUserGuild[]>(
    `/users/@me/guilds?with_counts=${withCounts}`,
  );
  if (res.error) {
    if (res.error.status === 401) redirect('/login');
    throw new Error(res.error.message);
  }
  return res.data;
}

export async function getMutualGuilds(withCounts = false) {
  const userGuilds = await getUserGuilds(withCounts);
  const mutualBotGuilds = await db.query.guild.findMany({
    where: (guild, { inArray }) =>
      inArray(
        guild.id,
        userGuilds.map((v) => v.id),
      ),
  });
  return userGuilds.filter((guild) => mutualBotGuilds.some((v) => v.id === guild.id));
}

export async function getMutualManagedGuilds(withCounts = false) {
  const mutualGuilds = await getMutualGuilds(withCounts);
  return mutualGuilds.filter((guild) =>
    hasPermission(guild.permissions, PermissionFlagsBits.ManageGuild),
  );
}
