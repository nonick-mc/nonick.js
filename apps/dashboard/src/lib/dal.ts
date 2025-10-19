import 'server-only';

import { PermissionFlagsBits } from 'discord-api-types/v10';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { auth } from './auth';
import { getGuild, getGuildMemberPermissions } from './discord/api';
import { hasPermission } from './discord/utils';
import { db } from './drizzle';

export const getCachedSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export const verifySession = cache(async () => {
  const session = await getCachedSession();
  if (!session) redirect('/login');
});

export const canAccessDashboard = cache(async (guildId: string) => {
  try {
    const session = await getCachedSession();
    if (!session) return false;

    const [guild, hasGuildSetting] = await Promise.all([
      getGuild(guildId),
      db.query.guild.findFirst({
        where: (guild, { eq }) => eq(guild.id, guildId),
      }),
    ]);

    if (!hasGuildSetting) return false;
    if (guild.owner_id === session.user.discordUserId) return true;

    const permissions = await getGuildMemberPermissions(guildId, session.user.discordUserId);
    const isManageGuild = hasPermission(permissions, PermissionFlagsBits.ManageGuild);
    const isAdministrator = hasPermission(permissions, PermissionFlagsBits.Administrator);

    return isManageGuild || isAdministrator;
  } catch {
    return false;
  }
});

export const verifyDashboardAccessPermission = cache(async (guildId: string) => {
  const isAccessible = await canAccessDashboard(guildId);
  if (!isAccessible) redirect('/');
});
