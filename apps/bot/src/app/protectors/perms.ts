import { Events, inlineCode, MessageFlags, type PermissionResolvable } from 'discord.js';
import { execute, Protector } from 'sunar';
import { Destructive, getAppEmoji } from '@/src/constants/emoji';

export function memberPerms(...requirePerms: PermissionResolvable[]) {
  const protector = new Protector({
    signals: [Events.InteractionCreate],
  });

  execute(protector, (arg, next) => {
    const entry = Array.isArray(arg) ? arg[0] : arg;
    if (!entry.inGuild()) return next();

    const missing = entry.memberPermissions.missing(requirePerms);
    const isMissing = !!missing.length;

    if (entry.isAutocomplete() && isMissing) return entry.respond([]);
    if (entry.isRepliable() && isMissing)
      return entry.reply({
        content: `${getAppEmoji(Destructive.cicleAlert)} この操作を実行するためには、以下の権限を所持している必要があります：${missing.map((perm) => inlineCode(perm)).join(' ')}`,
        flags: entry.ephemeral ? [MessageFlags.Ephemeral] : [],
      });

    return !isMissing && next();
  });

  return protector;
}

export function appPerms(...requirePerms: PermissionResolvable[]) {
  const protector = new Protector({
    signals: [Events.InteractionCreate],
  });

  execute(protector, (arg, next) => {
    const entry = Array.isArray(arg) ? arg[0] : arg;
    if (!entry.inGuild()) return next();

    const missing = entry.appPermissions.missing(requirePerms);
    const isMissing = !!missing.length;

    if (entry.isAutocomplete() && isMissing) return entry.respond([]);
    if (entry.isRepliable() && isMissing)
      return entry.reply({
        content: `${getAppEmoji(Destructive.cicleAlert)} この操作を実行するためには、${entry.client}に以下の権限を付与する必要があります：${missing.map((perm) => inlineCode(perm)).join(' ')}`,
        flags: entry.ephemeral ? [MessageFlags.Ephemeral] : [],
      });

    return !isMissing && next();
  });

  return protector;
}
