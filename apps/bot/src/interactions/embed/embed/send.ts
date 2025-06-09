import { Button } from '@akki256/discord-interaction';
import { PermissionFlagsBits, type User } from 'discord.js';

const sendEmbedButton = new Button(
  { customId: 'nonick-js:embedMaker-send' },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;
    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageWebhooks,
      )
    )
      return interaction.reply({
        content:
          '`❌` この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります。',
        ephemeral: true,
      });

    const embeds = interaction.message.embeds;
    const components = interaction.message.components;
    await interaction.update({
      content: '`⌛` 埋め込みを送信中...',
      embeds: [],
      components: [],
    });

    const webhook =
      (await (
        await interaction.guild.fetchWebhooks()
      )
        .find((v) => interaction.client.user.equals(v.owner as User))
        ?.edit({ channel: interaction.channelId })) ||
      (await interaction.guild.channels.createWebhook({
        name: 'NoNICK.js',
        avatar: interaction.client.user.displayAvatarURL(),
        channel: interaction.channelId,
      }));

    webhook
      .send({ embeds })
      .then(() =>
        interaction.editReply(
          '`✅` 埋め込みを送信しました！\n(`アプリ`→`埋め込みを編集`で埋め込みを編集・エクスポート、ロール付与ボタンの作成が可能です！)',
        ),
      )
      .catch(() => {
        interaction.editReply({ content: null, embeds, components });
        interaction.followUp({
          content: '`❌` 埋め込みの送信に失敗しました。',
          ephemeral: true,
        });
      });
  },
);

module.exports = [sendEmbedButton];
