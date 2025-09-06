import 'server-only';

import { PermissionFlagsBits } from 'discord-api-types/v10';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { getGuild, getGuildMember, getRoles } from './discord/api';
import { hasPermission } from './discord/utils';

/**
 * ダッシュボードのアクセス権限を持っているか確認
 * @param guildId サーバーID
 */
export async function hasDashboardAccessPermission(guildId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return false;

    const guild = await getGuild(guildId);
    const [roles, member] = await Promise.all([
      getRoles(guildId),
      getGuildMember(guildId, session.user.discordUserId),
    ]);

    const isGuildOwner = guild.owner_id === session.user.discordUserId;
    const hasAdminRole = roles
      .filter((role) => member.roles.includes(role.id))
      .some(
        (role) =>
          hasPermission(role.permissions, PermissionFlagsBits.ManageGuild) ||
          hasPermission(role.permissions, PermissionFlagsBits.Administrator),
      );

    return isGuildOwner || hasAdminRole;
  } catch {
    return false;
  }
}

/**
 * ダッシュボードのアクセス権限を持っていない場合にリダイレクトする
 * @param guildId サーバーID
 * @see {@link hasDashboardAccessPermission}
 */
export async function validateDashboardAccessPermission(guildId: string) {
  const hasPermission = await hasDashboardAccessPermission(guildId);
  if (!hasPermission) redirect('/');
}
