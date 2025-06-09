import type { PermissionFlags, Role } from 'discord.js';

const dangerPermissions = [
  'Administrator',
  'KickMembers',
  'BanMembers',
  'ManageChannels',
  'ManageGuild',
  'ManageMessages',
  'ManageRoles',
  'ManageWebhooks',
  'ManageGuildExpressions',
  'ManageEvents',
  'ManageThreads',
  'ModerateMembers',
] satisfies (keyof PermissionFlags)[];

export function getDangerPermission(role: Role) {
  return dangerPermissions.filter((v) => role.permissions.has(v));
}
