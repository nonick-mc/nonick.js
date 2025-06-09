import 'server-only';

import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { getGuild, getGuildMember, getRoles } from './discord/api';
import { hasPermission } from './discord/utils';

/**
 * ダッシュボードのアクセス権限を持っているか確認
 * @param guildId サーバーID
 * @param session セッション（{@link https://nextjs.org/docs/app/building-your-application/caching#request-memoization Request Memoization}が適用されない場合に使用する）
 */
export async function hasDashboardAccessPermission(guildId: string, session?: Session | null) {
  try {
    const currentSession = session || (await auth());
    if (!currentSession || currentSession.error) return false;

    const guild = await getGuild(guildId);

    const [roles, member] = await Promise.all([
      getRoles(guildId),
      getGuildMember(guildId, currentSession.user.id),
    ]);

    const isGuildOwner = guild.owner_id === currentSession.user.id;
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
 * @param session セッション（{@link https://nextjs.org/docs/app/building-your-application/caching#request-memoization Request Memoization}が適用されない場合に使用する）
 * @see {@link hasDashboardAccessPermission}
 */
export async function requireDashboardAccessPermission(guildId: string, session?: Session | null) {
  const hasPermission = await hasDashboardAccessPermission(guildId, session);
  if (!hasPermission) redirect('/');
}
