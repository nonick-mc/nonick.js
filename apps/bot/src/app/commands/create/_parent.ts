import { PermissionFlagsBits } from 'discord.js';
import { SlashParent } from 'sunar';

export const create = new SlashParent({
  name: 'create',
  description: '特定の機能に使用するメッセージパネルを作成',
  defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
  dmPermission: false,
});
