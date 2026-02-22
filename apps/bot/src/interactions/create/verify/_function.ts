import type { verificationSetting } from '@repo/database';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  Colors,
  ContainerBuilder,
  EmbedBuilder,
  GuildMemberFlags,
  inlineCode,
  MessageFlags,
  TextDisplayBuilder,
} from 'discord.js';
import type { InferSelectModel } from 'drizzle-orm';
import { dashboard } from '@/constants/links';
import { Captcha } from '@/modules/captcha';
import { Duration } from '@/modules/format';

const duringAuthentication = new Set<string>();

export function verifyForButtonCaptcha(
  interaction: ButtonInteraction<'cached'>,
  roleId: string | null,
  verificationMode: InferSelectModel<typeof verificationSetting>['mode'],
) {
  applyVerification(interaction, roleId, verificationMode)
    .then(() =>
      interaction.reply({
        content: `${inlineCode('✅')} 認証に成功しました！`,
        flags: [MessageFlags.Ephemeral],
      }),
    )
    .catch(() =>
      interaction.reply({
        content: `${inlineCode('❌')} 認証に問題が発生しました。サーバーの管理者にご連絡ください。`,
        flags: [MessageFlags.Ephemeral],
      }),
    );
}

export async function verifyForImageCaptcha(
  interaction: ButtonInteraction<'cached'>,
  roleId: string | null,
  verificationMode: InferSelectModel<typeof verificationSetting>['mode'],
) {
  if (duringAuthentication.has(interaction.user.id)) {
    return interaction.reply({
      content: `${inlineCode(
        '❌',
      )} 現在別の認証を行っています。認証が終了するまで新たな認証を行うことはできません。`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  const { image, text } = Captcha.create(
    { color: '#4b9d6e' },
    {},
    { amount: 5, blur: 25 },
    { rotate: 15, skew: true },
  );

  interaction.user
    .send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${interaction.guild.name} - 認証`,
            iconURL: interaction.guild.iconURL() ?? undefined,
          })
          .setDescription(
            [
              '下の画像に表示された、緑色の文字列をこのDMに送信してください。',
              '> ⚠️一定時間経過したり、複数回間違えると新しい認証を発行する必要があります。',
            ].join('\n'),
          )
          .setColor(Colors.Blurple)
          .setImage('attachment://nonick-js-captcha.jpeg')
          .setFooter({
            text: 'NoNICK.jsはパスワードの入力やQRコードの読み取りを要求することは決してありません。',
          }),
      ],
      files: [new AttachmentBuilder(image, { name: 'nonick-js-captcha.jpeg' })],
    })
    .then(() => {
      duringAuthentication.add(interaction.user.id);
      interaction.followUp(`${inlineCode('📨')} DMで認証を続けてください。`);

      if (!interaction.user.dmChannel) return;

      const collector = interaction.user.dmChannel.createMessageCollector({
        filter: (v) => v.author.id === interaction.user.id,
        time: Duration.toMS('1m'),
      });

      collector.on('collect', (tryMessage) => {
        if (tryMessage.content !== text) {
          // 3回認証コードが異なっていた場合
          if (collector.collected.size === 3) {
            interaction.user.send(
              `${inlineCode('❌')} 試行回数を超えて検証に失敗しました。次回の検証は${inlineCode(
                '5分後',
              )}から可能になります。`,
            );
            setTimeout(() => duringAuthentication.delete(interaction.user.id), Duration.toMS('5m'));
            return collector.stop();
          }

          return interaction.user.send('`❌️` 認証コードが間違っています。');
        }

        applyVerification(interaction, roleId, verificationMode)
          .then(() => interaction.user.send(`${inlineCode('✅')} 認証に成功しました！`))
          .catch(() =>
            interaction.user.send(
              `${inlineCode('❌')} 認証に問題が発生しました。サーバーの管理者にご連絡ください。`,
            ),
          )
          .finally(() => {
            duringAuthentication.delete(interaction.user.id);
            collector.stop();
          });
      });
    })
    .catch(() => {
      interaction.followUp({
        content: `${inlineCode(
          '❌',
        )} この認証を行うにはBOTからDMを受け取れるように設定する必要があります。`,
        flags: [MessageFlags.Ephemeral],
      });
    });
}

export function verifyForWebCaptcha(interaction: ButtonInteraction<'cached'>) {
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

export function applyVerification(
  interaction: ButtonInteraction<'cached'>,
  roleId: string | null,
  verificationMode: InferSelectModel<typeof verificationSetting>['mode'],
) {
  switch (verificationMode) {
    case 'role':
      return interaction.member.roles.add(roleId as string, '認証');
    case 'bypass_verification': {
      const flags = interaction.member.flags.add(GuildMemberFlags.BypassesVerification);
      return interaction.member.setFlags(flags, '認証');
    }
  }
}
