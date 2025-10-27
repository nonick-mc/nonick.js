import 'server-only';

import { PermissionFlagsBits } from 'discord-api-types/v10';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { auth } from './auth';
import { getCurrentUserGuilds, getGuild, getGuildMemberPermissions } from './discord/api';
import { hasPermission } from './discord/utils';
import { db } from './drizzle';
import { getVerificationSetting } from './dto';

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

export const isAvailableVerifyPage = cache(async (guildId: string) => {
  try {
    const [setting, guild] = await Promise.all([
      getVerificationSetting(guildId),
      getGuild(guildId).catch(() => null),
    ]);

    if (!guild) return false;
    return setting?.enabled && setting.captchaType === 'web';
  } catch {
    return false;
  }
});

export const canAccessVerifyPage = cache(async (guildId: string) => {
  try {
    const session = await getCachedSession();
    if (!session) return false;

    const isAvailable = await isAvailableVerifyPage(guildId);
    if (!isAvailable) return false;

    const userGuilds = await getCurrentUserGuilds();
    return userGuilds.some((guild) => guild.id === guildId);
  } catch {
    return false;
  }
});
