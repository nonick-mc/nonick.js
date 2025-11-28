import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { execute, Slash } from 'sunar';
import { danger, getBotEmoji } from '@/constants/emojis.js';
import { missingPermissionMessage } from '@/lib/messages.js';

export const slash = new Slash({
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
});

execute(slash, async (interaction) => {
  if (!interaction.inGuild() || !interaction.channel?.isSendable()) return;

  let requirePermission = PermissionFlagsBits.ViewChannel | PermissionFlagsBits.ReadMessageHistory;
  if (interaction.channel.isVoiceBased())
    requirePermission = requirePermission | PermissionFlagsBits.Connect;

  if (!interaction.appPermissions.has(requirePermission)) {
    return interaction.reply({
      content: missingPermissionMessage(interaction.appPermissions.missing(requirePermission)),
      flags: [MessageFlags.Ephemeral],
    });
  }

  const messages = await interaction.channel.messages.fetch({ after: '0', limit: 1 });
  const firstMessage = messages.first();

  if (!firstMessage) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} メッセージの取得に失敗しました。`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  interaction.reply({
    content: interaction.options.getString('content') ?? undefined,
    components: [
      new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setLabel(interaction.options.getString('label') ?? '最上部へ移動')
          .setURL(firstMessage.url)
          .setStyle(ButtonStyle.Link),
      ),
    ],
  });
});
