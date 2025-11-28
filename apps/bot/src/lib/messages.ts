import { stripIndents } from 'common-tags';
import { inlineCode, type PermissionsString, subtext } from 'discord.js';
import { getBotEmoji, warning } from '@/constants/emojis.js';
import { permToText } from './util.js';

export function missingPermissionMessage(perms: PermissionsString[]) {
  return stripIndents`
    ${getBotEmoji(warning.circleAlert)} このコマンドを使用するには、Botの権限に${permToText(
      ...perms,
    )
      .map((v) => inlineCode(v))
      .join(', ')}を追加する必要があります。
    ${subtext('この権限を既にロールで付与している場合は、チャンネルで権限が無効にされている可能性があります。')}
  `;
}
