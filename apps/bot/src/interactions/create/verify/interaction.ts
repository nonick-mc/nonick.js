import { Button } from '@akki256/discord-interaction';
import { dashboard } from '@const/links';
import { db } from '@modules/drizzle';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
  inlineCode,
} from 'discord.js';
import { verifyForButtonCaptcha, verifyForImageCaptcha } from './_function';

const verifyButton = new Button(
  {
    customId: 'nonick-js:verify',
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting?.enabled || !setting.role) {
      return interaction.reply({
        content:
          '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。',
        flags: MessageFlags.Ephemeral,
      });
    }

    const role = await interaction.guild.roles
      .fetch(setting.role)
      .catch(() => null);

    if (!role) {
      return interaction.reply({
        content:
          '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({
        content: `${inlineCode('✅')} 既に認証されています。`,
        flags: MessageFlags.Ephemeral,
      });
    }

    switch (setting.captchaType) {
      case 'button':
        return verifyForButtonCaptcha(interaction, role.id);
      case 'image':
        return verifyForImageCaptcha(interaction, role.id);
      case 'web':
        return interaction.reply({
          components: [
            new ContainerBuilder()
              .addTextDisplayComponents([
                new TextDisplayBuilder().setContent(
                  [
                    '### 下のボタンから認証ページにアクセスしてください',
                    '-# ⚠️ NoNICK.jsはパスワードの入力やQRコードの読み取りを要求することは決してありません。',
                  ].join('\n'),
                ),
              ])
              .addActionRowComponents([
                new ActionRowBuilder<ButtonBuilder>().setComponents([
                  new ButtonBuilder()
                    .setLabel('クリックして認証を続行')
                    .setURL(`${dashboard}/verify/guilds/${interaction.guildId}`)
                    .setStyle(ButtonStyle.Link),
                ]),
              ]),
          ],
          flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        });
    }
  },
);

export default [verifyButton];
