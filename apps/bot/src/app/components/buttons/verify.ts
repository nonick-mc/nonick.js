import { stripIndent, stripIndents } from 'common-tags';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  ContainerBuilder,
  escapeMarkdown,
  GuildMemberRoleManager,
  HeadingLevel,
  heading,
  inlineCode,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  subtext,
  TextDisplayBuilder,
} from 'discord.js';
import { Button, execute } from 'sunar';
import {
  danger,
  defaultColor,
  getBotEmoji,
  primary,
  success,
  warning,
} from '@/constants/emojis.js';
import { Links } from '@/constants/links.js';
import { Captcha } from '@/lib/captcha.js';
import { db } from '@/lib/drizzle.js';

const duringAuthentication = new Set<string>();

export const button = new Button({
  id: /^(verify|nonick-js:verify)$/,
});

execute(button, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const setting = await db.query.verificationSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
  });

  if (!setting?.enabled || !setting.role) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} 現在この機能はサーバーの管理者によって無効化されています。`,
      flags: MessageFlags.Ephemeral,
    });
  }

  const role = await interaction.guild.roles.fetch(setting.role).catch(() => null);

  if (!role) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} 認証ロールが存在しないため、現在この機能を使用することができません。サーバーの管理者にお問い合わせください。`,
      flags: MessageFlags.Ephemeral,
    });
  }

  if (interaction.member.roles.cache.has(role.id)) {
    return interaction.reply({
      content: `${getBotEmoji(success.circleCheck)} 既に認証されています。`,
      flags: MessageFlags.Ephemeral,
    });
  }

  switch (setting.captchaType) {
    case 'button':
      return buttonVerify(interaction, role.id);
    case 'image':
      return imageVerify(interaction, role.id);
    case 'web':
      return webVerify(interaction);
  }
});

// #region 互換性維持のために過去バージョンの認証を実装
export const legacyButton = new Button({
  id: /^nonick-js:verify-(button|image)$/,
});

execute(legacyButton, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const roleId = interaction.message.embeds[0]?.fields[0]?.value?.match(/(?<=<@&)\d+(?=>)/)?.[0];
  const roles = interaction.member.roles;

  if (!roleId || !(roles instanceof GuildMemberRoleManager))
    return interaction.reply({
      content: `${inlineCode('❌')} 認証中に問題が発生しました。`,
      flags: MessageFlags.Ephemeral,
    });
  if (roles.cache.has(roleId))
    return interaction.reply({
      content: `${inlineCode('✅')} 既に認証されています。`,
      flags: MessageFlags.Ephemeral,
    });

  if (interaction.customId === 'nonick-js:verify-button') {
    return buttonVerify(interaction, roleId);
  }

  if (interaction.customId === 'nonick-js:verify-image') {
    return imageVerify(interaction, roleId);
  }
});
// #endregion

// #region　verify
function buttonVerify(interaction: ButtonInteraction<'cached'>, roleId: string) {
  interaction.member.roles
    .add(roleId, 'メンバー認証に成功しました')
    .then(() =>
      interaction.reply({
        content: `${getBotEmoji(success.circleCheck)} 認証に成功しました！`,
        flags: MessageFlags.Ephemeral,
      }),
    )
    .catch(() =>
      interaction.reply({
        content: `${getBotEmoji(danger.circleX)} 認証に成功しましたが、ロールを付与することができませんでした。サーバーの管理者にお問い合わせください。`,
        flags: MessageFlags.Ephemeral,
      }),
    );
}

async function imageVerify(interaction: ButtonInteraction<'cached'>, roleId: string) {
  if (duringAuthentication.has(interaction.user.id)) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} 現在別の認証を行っています。認証が終了するまで新たな認証を行うことはできません。`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const { image, text } = Captcha.create(
    { color: '#4b9d6e' },
    {},
    { amount: 5, blur: 25 },
    { rotate: 15, skew: true },
  );

  interaction.user
    .send({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(
              heading(
                `${getBotEmoji(defaultColor.qrCode)} ${inlineCode(escapeMarkdown(interaction.guild.name))} - 認証`,
                HeadingLevel.Three,
              ),
            ),
          ])
          .addSeparatorComponents([
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
          ])
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(stripIndent`
            下の画像に表示された、緑色の文字列をメッセージとして送信してください。
            ${subtext('一定時間経過したり、複数回間違えると新しい認証を発行する必要があります。')}
          `),
          ])
          .addSeparatorComponents([
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
          ])
          .addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems([
              new MediaGalleryItemBuilder().setURL('attachment://nonick-js-captcha.jpeg'),
            ]),
          ),
      ],
      files: [new AttachmentBuilder(image, { name: 'nonick-js-captcha.jpeg' })],
      flags: MessageFlags.IsComponentsV2,
    })
    .then(() => {
      duringAuthentication.add(interaction.user.id);
      interaction.followUp(`${getBotEmoji(primary.info)} DMで認証を続けてください。`);

      if (!interaction.user.dmChannel) return;

      const collector = interaction.user.dmChannel.createMessageCollector({
        filter: (v) => v.author.id === interaction.user.id,
        time: 60_000,
      });

      collector.on('collect', (tryMessage) => {
        // 認証コードが異なっていた場合
        if (tryMessage.content.toUpperCase() !== text) {
          // 3回認証コードが異なっていた場合
          if (collector.collected.size === 3) {
            interaction.user.send(
              `${getBotEmoji(warning.circleAlert)} 試行回数を超えて検証に失敗しました。次回の検証は${inlineCode('5')}分後から可能になります。`,
            );
            setTimeout(() => duringAuthentication.delete(interaction.user.id), 5 * 60_000);
            return collector.stop();
          }

          return interaction.user.send(
            `${getBotEmoji(danger.circleX)} 認証コードが間違っています。`,
          );
        }

        interaction.member.roles
          .add(roleId, 'メンバー認証に成功しました')
          .then(() =>
            interaction.user.send({
              content: `${getBotEmoji(success.circleCheck)} 認証に成功しました！`,
            }),
          )
          .catch(() =>
            interaction.user.send({
              content: `${getBotEmoji(danger.circleX)} 認証に成功しましたが、ロールを付与することができませんでした。サーバーの管理者にお問い合わせください。`,
            }),
          )
          .finally(() => {
            duringAuthentication.delete(interaction.user.id);
            collector.stop();
          });
      });
    })
    .catch(() =>
      interaction.followUp({
        content: `${getBotEmoji(danger.circleX)} この認証を行うにはBOTからDMを受け取れるように設定する必要があります。`,
        flags: MessageFlags.Ephemeral,
      }),
    );
}

function webVerify(interaction: ButtonInteraction<'cached'>) {
  return interaction.reply({
    components: [
      new ContainerBuilder()
        .addTextDisplayComponents([
          new TextDisplayBuilder().setContent(stripIndents`
            ${heading('下のボタンから認証ページにアクセスしてください', HeadingLevel.Three)}
            ${subtext(`${getBotEmoji(warning.circleAlert)} NoNICK.jsは、Discordの公式サイト以外でパスワードの入力やQRコードの読み取りを要求することは決してありません。`)}
          `),
        ])
        .addActionRowComponents([
          new ActionRowBuilder<ButtonBuilder>().setComponents([
            new ButtonBuilder()
              .setLabel('クリックして認証を続行')
              .setURL(`${Links.dashboard}/verify/guilds/${interaction.guildId}`)
              .setStyle(ButtonStyle.Link),
          ]),
        ]),
    ],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  });
}
// #endregion
