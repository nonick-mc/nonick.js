import { oneLineTrim, stripIndents } from 'common-tags';
import {
  hideLinkEmbed,
  hyperlink,
  LabelBuilder,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  roleMention,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { execute, SlashSubcommand } from 'sunar';
import { danger, getBotEmoji } from '@/constants/emojis.js';
import { Links } from '@/constants/links.js';
import { db } from '@/lib/drizzle.js';
import { missingPermissionMessage } from '@/lib/messages.js';

export const slash = new SlashSubcommand('create', {
  name: 'verification-panel',
  description: 'メンバー認証に使用するパネルを作成',
});

execute(slash, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const setting = await db.query.verificationSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
  });

  if (!setting?.enabled || !setting.role) {
    return interaction.reply({
      content: oneLineTrim`
        ${getBotEmoji(danger.circleX)} この機能を使用するには、
        ${hyperlink('ダッシュボード', hideLinkEmbed(`${Links.dashboard}/guilds/${interaction.guild.id}/verification`))}
        で設定を有効にする必要があります。
      `,
      flags: [MessageFlags.Ephemeral],
    });
  }

  const requirePermission = PermissionFlagsBits.ViewChannel | PermissionFlagsBits.SendMessages;

  if (!interaction.appPermissions.has(requirePermission)) {
    return interaction.reply({
      content: missingPermissionMessage(interaction.appPermissions.missing(requirePermission)),
      flags: [MessageFlags.Ephemeral],
    });
  }

  interaction.showModal(
    new ModalBuilder()
      .setCustomId('create-verification-panel')
      .setTitle('認証パネル作成')
      .setLabelComponents([
        new LabelBuilder()
          .setLabel('タイトル')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('title')
              .setValue('認証')
              .setStyle(TextInputStyle.Short),
          ),
        new LabelBuilder()
          .setLabel('説明')
          .setDescription('マークダウンを使用できます。')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('description')
              .setValue(stripIndents`
                下の「認証」ボタンを押して認証を行ってください。
                認証が完了すると、${roleMention(setting.role)}が付与されます。
              `)
              .setStyle(TextInputStyle.Paragraph),
          ),
        new LabelBuilder()
          .setLabel('ボタンのラベル')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('button-label')
              .setValue('認証')
              .setMaxLength(80)
              .setStyle(TextInputStyle.Short),
          ),
      ]),
  );
});
