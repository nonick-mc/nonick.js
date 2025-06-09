import { Button, Modal } from '@akki256/discord-interaction';
import { isURL } from '@modules/util';
import {
  type ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonComponent,
  ButtonStyle,
  ComponentType,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

const sendLinkButton = new Button(
  { customId: 'nonick-js:embedMaker-linkButton-send' },
  (interaction) => {
    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-linkButton-sendModal')
        .setTitle('ボタンを作成')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('url')
              .setLabel('URL')
              .setStyle(TextInputStyle.Short),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('label')
              .setLabel('ボタンのテキスト')
              .setMaxLength(80)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('emojiNameOrId')
              .setLabel('Unicode絵文字 または カスタム絵文字')
              .setPlaceholder('一文字のみ・カスタム絵文字は名前かIDを入力')
              .setMaxLength(32)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );
  },
);

const sendLinkButtonModal = new Modal(
  { customId: 'nonick-js:embedMaker-linkButton-sendModal' },
  async (interaction) => {
    // Create Button
    if (
      !interaction.isFromMessage() ||
      !interaction.inCachedGuild() ||
      interaction.message.components[0].type !== ComponentType.ActionRow ||
      interaction.message.components[0].components[0].type !==
        ComponentType.Button ||
      !interaction.channel
    )
      return;

    const emojiRegex = new RegExp(
      /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu,
    );
    const label = interaction.fields.getTextInputValue('label');
    const url = interaction.fields.getTextInputValue('url');
    const emojiNameOrId = interaction.fields.getTextInputValue('emojiNameOrId');
    const emoji =
      interaction.guild.emojis.cache.find((v) => v.name === emojiNameOrId)
        ?.id || emojiNameOrId.match(emojiRegex)?.[0];

    if (!label && !emoji)
      return interaction.reply({
        content:
          '`❌` ボタンのテキストと絵文字はどちらは必ず入力する必要があります',
        ephemeral: true,
      });
    if (!isURL(url))
      return interaction.reply({
        content:
          '`❌` `http://`または`https://`から始まるURLを入力してください。',
        ephemeral: true,
      });

    const button = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(url);

    if (emoji) button.setEmoji(emoji);
    if (label) button.setLabel(label);

    // Edit Message
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
    if (
      targetMessage.components[4]?.type === ComponentType.ActionRow &&
      targetMessage.components[4]?.components?.length === 5
    )
      return interaction.reply({
        content: '`❌` これ以上コンポーネントを追加できません！',
        ephemeral: true,
      });
    if (
      targetMessage.components[0]?.type === ComponentType.ActionRow &&
      targetMessage.components[0]?.components[0]?.type ===
        ComponentType.StringSelect
    )
      return interaction.reply({
        content:
          '`❌` セレクトメニューとボタンは同じメッセージに追加できません。',
        ephemeral: true,
      });

    const updatedComponents = targetMessage.components.map((v) =>
      ActionRowBuilder.from<ButtonBuilder>(v as ActionRow<ButtonComponent>),
    );
    const lastActionRow = updatedComponents.slice(-1)[0];

    if (!lastActionRow || lastActionRow.components.length === 5)
      updatedComponents.push(
        new ActionRowBuilder<ButtonBuilder>().setComponents(button),
      );
    else
      updatedComponents.splice(
        updatedComponents.length - 1,
        1,
        ActionRowBuilder.from<ButtonBuilder>(lastActionRow).addComponents(
          button,
        ),
      );

    const embeds = interaction.message.embeds;
    const components = interaction.message.components;
    await interaction.update({
      content: '`⌛` コンポーネントを追加中...',
      embeds: [],
      components: [],
    });

    await webhook.edit({ channel: interaction.channelId });
    webhook
      .editMessage(targetMessage, { components: updatedComponents })
      .then(() =>
        interaction.editReply({
          content: '`✅` コンポーネントを追加しました！',
          embeds,
          components,
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

module.exports = [sendLinkButton, sendLinkButtonModal];
