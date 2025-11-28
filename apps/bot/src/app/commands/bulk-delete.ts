import {
  ApplicationCommandOptionType,
  inlineCode,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { config, execute, Slash } from 'sunar';
import { danger, getBotEmoji, success } from '@/constants/emojis.js';
import { permissionTexts } from '@/lib/util.js';

export const slash = new Slash({
  name: 'bulkdelete',
  description:
    'このチャンネルに送信されたメッセージを新しい順に削除 (2週間前までに送信されたメッセージが対象)',
  options: [
    {
      name: 'messages',
      description: '削除するメッセージの数',
      type: ApplicationCommandOptionType.Integer,
      minValue: 2,
      maxValue: 100,
      required: true,
    },
  ],
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
});

config(slash, {
  cooldown: 10_000,
});

execute(slash, async (interaction) => {
  if (!interaction.inCachedGuild() || !interaction.channel?.isTextBased()) return;

  if (!interaction.appPermissions.has(PermissionFlagsBits.ManageMessages)) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} このコマンドを使用するには、Botに${inlineCode(permissionTexts.ManageMessages)}権限を付与する必要があります。`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  const bulkCount = interaction.options.getInteger('messages', true);

  interaction.channel
    .bulkDelete(bulkCount, true)
    .then((messages) =>
      interaction.reply({
        content: `${getBotEmoji(success.circleCheck)} メッセージを${inlineCode(messages.size.toString())}件削除しました。`,
        flags: [MessageFlags.Ephemeral],
      }),
    )
    .catch(() =>
      interaction.reply({
        content: `${getBotEmoji(danger.circleX)} メッセージの削除に失敗しました。`,
        flags: [MessageFlags.Ephemeral],
      }),
    );
});
