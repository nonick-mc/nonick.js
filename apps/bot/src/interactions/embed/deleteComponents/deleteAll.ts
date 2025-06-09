import { Button } from '@akki256/discord-interaction';
import { PermissionFlagsBits } from 'discord.js';

const button = new Button(
  { customId: 'nonick-js:manageComponents-deleteAll' },
  async (interaction) => {
    if (!interaction.inCachedGuild() || !interaction.channel) return;

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

    const targetId =
      interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    if (!targetId) return;
    const targetMessage = await (await interaction.channel.fetch()).messages
      .fetch(targetId)
      .catch(() => undefined);

    if (!targetMessage)
      return interaction.reply({
        content: '`❌` メッセージの取得中に問題が発生しました。',
        ephemeral: true,
      });

    const webhook = await targetMessage.fetchWebhook().catch(() => null);
    if (!webhook || interaction.client.user.id !== webhook.owner?.id)
      return interaction.reply({
        content: '`❌` このメッセージは更新できません。',
        ephemeral: true,
      });

    await interaction.update({
      content: '`⌛` コンポーネントを削除中...',
      embeds: [],
      components: [],
    });

    webhook
      .editMessage(targetMessage, { components: [] })
      .then(() => interaction.editReply('`✅` コンポーネントを削除しました。'))
      .catch(() =>
        interaction.editReply('`❌` コンポーネントの削除に失敗しました。'),
      );
  },
);

module.exports = [button];
