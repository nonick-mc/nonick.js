import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  inlineCode,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'firstmessage',
    description: 'チャンネルの最初に投稿されたメッセージのURLボタンを送信',
    options: [
      {
        name: 'content',
        description: 'メッセージ',
        type: ApplicationCommandOptionType.String,
        maxLength: 200,
      },
      {
        name: 'label',
        description: 'ボタンのテキスト',
        type: ApplicationCommandOptionType.String,
        maxLength: 80,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: [
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageMessages,
    ],
  },
  { coolTime: Duration.toMS('50s') },
  (interaction) => {
    if (!(interaction.inGuild() && interaction.channel)) return;

    interaction.channel.messages
      .fetch({ after: '0', limit: 1 })
      .then((messages) => {
        const message = messages.first();
        if (!message) throw new ReferenceError();
        interaction.reply({
          content: interaction.options.getString('content') ?? undefined,
          components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setLabel(
                  interaction.options.getString('label') ?? '最上部へ移動',
                )
                .setURL(message.url)
                .setStyle(ButtonStyle.Link),
            ),
          ],
        });
      })
      .catch(() => {
        interaction.reply({
          content: `${inlineCode('❌')} メッセージを取得できませんでした`,
          ephemeral: true,
        });
      });
  },
);
