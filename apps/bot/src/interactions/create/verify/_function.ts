import { Captcha } from '@modules/captcha';
import { Duration } from '@modules/format';
import {
  AttachmentBuilder,
  type ButtonInteraction,
  Colors,
  EmbedBuilder,
  MessageFlags,
  inlineCode,
} from 'discord.js';

const duringAuthentication = new Set<string>();

export function verifyForButtonCaptcha(
  interaction: ButtonInteraction<'cached'>,
  roleId: string,
) {
  interaction.member.roles
    .add(roleId, '認証')
    .then(() =>
      interaction.reply({
        content: `${inlineCode('✅')} 認証に成功しました！`,
        ephemeral: true,
      }),
    )
    .catch(() =>
      interaction.reply({
        content: `${inlineCode(
          '❌',
        )} ロールを付与できませんでした。サーバーの管理者にご連絡ください`,
        ephemeral: true,
      }),
    );
}

export async function verifyForImageCaptcha(
  interaction: ButtonInteraction<'cached'>,
  roleId: string,
) {
  if (duringAuthentication.has(interaction.user.id)) {
    return interaction.reply({
      content: `${inlineCode(
        '❌',
      )} 現在別の認証を行っています。認証が終了するまで新たな認証を行うことはできません。`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await interaction.deferReply({ ephemeral: true });

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
        max: 3,
      });

      collector.on('collect', (tryMessage) => {
        if (tryMessage.content !== text) return;

        interaction.member.roles
          .add(roleId, '認証')
          .then(() =>
            interaction.user.send(`${inlineCode('✅')} 認証に成功しました！`),
          )
          .catch(() =>
            interaction.user.send(
              `${inlineCode(
                '❌',
              )} ロールを付与できませんでした。サーバーの管理者にご連絡ください`,
            ),
          )
          .finally(() => collector.stop());
      });

      collector.on('end', (collection) => {
        if (collection.size === 3) {
          interaction.user.send(
            `${inlineCode(
              '❌',
            )} 試行回数を超えて検証に失敗しました。次回の検証は${inlineCode(
              '5分後',
            )}から可能になります。`,
          );
          setTimeout(
            () => duringAuthentication.delete(interaction.user.id),
            Duration.toMS('5m'),
          );
        } else duringAuthentication.delete(interaction.user.id);
      });
    })
    .catch(() => {
      interaction.followUp({
        content: `${inlineCode(
          '❌',
        )} この認証を行うにはBOTからDMを受け取れるように設定する必要があります。`,
        ephemeral: true,
      });
    });
}
