import 'server-only';

import { PermissionFlagsBits } from 'discord-api-types/v10';
import { getGuildMemberPermissions } from '@/lib/discord/api';
import { hasPermission } from '@/lib/discord/utils';
import { BotPermissionWarningDialog } from './bot-permission-warning-dialog';

type BotPermissionWarningProps = {
  guildId: string;
};

export async function BotPermissionWarning({ guildId }: BotPermissionWarningProps) {
  const botUserId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const requiredPermissions = process.env.NEXT_PUBLIC_DISCORD_INVITE_PERMISSION;

  if (!(botUserId && requiredPermissions)) return null;

  try {
    const permissions = await getGuildMemberPermissions(guildId, botUserId);
    const required = BigInt(requiredPermissions);

    if (
      hasPermission(permissions, PermissionFlagsBits.Administrator) ||
      hasPermission(permissions, required)
    ) {
      return null;
    }

    return <BotPermissionWarningDialog guildId={guildId} />;
  } catch {
    return null;
  }
}
