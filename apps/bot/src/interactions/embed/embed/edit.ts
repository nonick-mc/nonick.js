import { Button } from '@akki256/discord-interaction';
import { PermissionFlagsBits } from 'discord.js';

const editEmbedButton = new Button(
  { customId: 'nonick-js:embedMaker-edit' },
  async (interaction) => {
    if (!interaction.inCachedGuild() || !interaction.channel) return;

    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageWebhooks))
      return interaction.reply({ content: '`❌` この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります。', ephemeral: true });

    const targetId = interaction.message.content.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await (await interaction.channel.fetch()).messages.fetch(targetId || '').catch(() => undefined);
    if (!targetMessage)
      return interaction.reply({ content: '`❌` メッセージの取得中に問題が発生しました。', ephemeral: true });

    const webhook = await targetMessage.fetchWebhook().catch(() => null);
    if (!webhook || interaction.client.user.id !== webhook.owner?.id)
      return interaction.reply({ content: '`❌` このメッセージは更新できません。', ephemeral: true });

    const embeds = interaction.message.embeds;
    const components = interaction.message.components;
    await interaction.update({ content: '`⌛` 埋め込みを編集中...', embeds: [], components: [] });
    await webhook.edit({ channel: interaction.channelId });

    webhook
      .editMessage(targetMessage, { embeds })
      .then(() => interaction.editReply('`✅` 埋め込みを編集しました！'))
      .catch(() => {
        interaction.editReply({ content: null, embeds, components });
        interaction.followUp({ content: '`❌` 埋め込みの編集に失敗しました。', ephemeral: true });
      });
  },
);

module.exports = [editEmbedButton];