import { Button } from '@akki256/discord-interaction';
import {
  ActionRowBuilder,
  ComponentType,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
} from 'discord.js';
import { getRoleSelectMakerButtons } from './_function';

const addRoleSelectButton = new Button(
  { customId: 'nonick-js:embedMaker-selectRole-sendComponent' },
  async (interaction) => {
    if (!interaction.inCachedGuild() || !interaction.channel) return;
    if (
      interaction.message.components[0].type !== ComponentType.ActionRow ||
      interaction.message.components[1].type !== ComponentType.ActionRow
    )
      return;

    if (
      interaction.message.components[0].components[0].type !==
      ComponentType.StringSelect
    )
      return interaction.reply({
        content: '`❌` セレクトメニューを作成していません！',
        ephemeral: true,
      });
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

    const roleSelect = interaction.message.components[0].components[0];
    const selectStatusButton = interaction.message.components[1].components[3];
    const targetId =
      interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await (await interaction.channel.fetch()).messages
      .fetch(targetId || '')
      .catch(() => undefined);

    if (!targetMessage)
      return interaction.reply({
        content: '`❌` メッセージの取得中に問題が発生しました。',
        ephemeral: true,
      });

    const webhook = await targetMessage.fetchWebhook().catch(() => null);
    console.log(webhook);

    if (!webhook || interaction.client.user.id !== webhook.owner?.id)
      return interaction.reply({
        content: '`❌` このメッセージは更新できません。',
        ephemeral: true,
      });
    if (targetMessage.components.length === 5)
      return interaction.reply({
        content: '`❌` これ以上コンポーネントを追加できません！',
        ephemeral: true,
      });
    if (
      targetMessage.components[0]?.type === ComponentType.ActionRow &&
      targetMessage.components[0]?.components[0]?.type === ComponentType.Button
    )
      return interaction.reply({
        content:
          '`❌` セレクトメニューとボタンは同じメッセージに追加できません。',
        ephemeral: true,
      });

    const embeds = interaction.message.embeds;
    const components = interaction.message.components;
    await interaction.update({
      content: '`⌛` コンポーネントを追加中...',
      embeds: [],
      components: [],
    });

    webhook
      .editMessage(targetMessage, {
        components: [
          ...targetMessage.components,
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            StringSelectMenuBuilder.from(roleSelect.toJSON())
              .setCustomId(
                `${roleSelect.customId}-${targetMessage.components.length + 1}`,
              )
              .setMaxValues(
                selectStatusButton.customId ===
                  'nonick-js:embedMaker-selectRole-selectMode-multi'
                  ? roleSelect.options.length
                  : 1,
              ),
          ),
        ],
      })
      .then(() =>
        interaction.editReply({
          content: '`✅` コンポーネントを追加しました！',
          embeds,
          components: [getRoleSelectMakerButtons()],
        }),
      )
      .catch(() =>
        interaction.editReply({
          content: '`❌` コンポーネントの更新中に問題が発生しました。',
          embeds,
          components,
        }),
      );
  },
);

module.exports = [addRoleSelectButton];
