import { ChatInput } from '@akki256/discord-interaction';
import { permissionField } from '@modules/fields';
import { Duration } from '@modules/format';
import { permToText } from '@modules/util';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  codeBlock,
  inlineCode,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'bulkdelete',
    description:
      'このチャンネルに送信されたメッセージを最新順に一括削除 (2週間前まで)',
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
  },
  { coolTime: Duration.toMS('10s') },
  (interaction) => {
    if (!(interaction.inGuild() && interaction.channel)) return;
    if (!interaction.appPermissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({
        content: permissionField(permToText('ManageChannels'), {
          label: 'BOTの権限が不足しています',
        }),
        ephemeral: true,
      });
    const bulkCount = interaction.options.getInteger('messages', true);

    interaction.channel
      .bulkDelete(bulkCount, true)
      .then(() =>
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${inlineCode('✅')} メッセージを${inlineCode(
                  `${bulkCount}件`,
                )}削除しました`,
              )
              .setColor(Colors.Green),
          ],
          ephemeral: true,
        }),
      )
      .catch((err) =>
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                [
                  `${inlineCode('❌')} メッセージの削除に失敗しました`,
                  codeBlock(err),
                ].join('\n'),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        }),
      );
  },
);
