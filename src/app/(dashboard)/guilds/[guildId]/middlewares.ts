import { auth } from '@/auth';
import { getGuild, getGuildMember, getRoles, hasPermission } from '@/lib/discord';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import 'server-only';

/** ダッシュボードのアクセス権限を持っているか確認 */
export async function hasAccessPermission(guildId: string) {
  try {
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
