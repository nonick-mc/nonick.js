import { Button, Modal } from '@akki256/discord-interaction';
import { getDangerPermission } from '@modules/embed';
import { permToText } from '@modules/util';
import {
  type ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonComponent,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  Role,
  TextInputBuilder,
  TextInputStyle,
  inlineCode,
} from 'discord.js';

const sendRoleButton = new Button(
  { customId: 'nonick-js:embedMaker-roleButton-send' },
  (interaction) => {
    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-roleButton-sendModal')
        .setTitle('ボタンを作成')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('roleNameOrId')
              .setLabel('ロールの名前またはID')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('displayName')
              .setLabel('ボタン上での表示名')
              .setPlaceholder('例: マイクラ勢')
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

const sendRoleButtonModal = new Modal(
  { customId: 'nonick-js:embedMaker-roleButton-sendModal' },
  async (interaction) => {
    // Create Button
    if (
      !interaction.isFromMessage() ||
      !interaction.inCachedGuild() ||
      interaction.message.components[0].type !== ComponentType.ActionRow ||
      interaction.message.components[0].components[1].type !==
        ComponentType.Button ||
      !interaction.channel
    )
      return;

    const emojiRegex = new RegExp(
      /\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu,
    );
    const roleNameOrId = interaction.fields.getTextInputValue('roleNameOrId');
    const emojiNameOrId = interaction.fields.getTextInputValue('emojiNameOrId');
    const displayName = interaction.fields.getTextInputValue('displayName');

    const role = interaction.guild?.roles.cache.find(
      (v) => v.name === roleNameOrId || v.id === roleNameOrId,
    );
    const emoji =
      interaction.guild.emojis.cache.find(
        (v) => v.name === emojiNameOrId || v.id === emojiNameOrId,
      )?.id || emojiNameOrId.match(emojiRegex)?.[0];

    if (!(role instanceof Role))
      return interaction.reply({
        content: '`❌` 入力された値に一致するロールが見つかりませんでした。',
        ephemeral: true,
      });
    if (role?.managed)
      return interaction.reply({
        content:
          '`❌` そのロールは外部サービスによって管理されているため、セレクトメニューに追加できません。',
        ephemeral: true,
      });
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
      interaction.member.roles.highest.position < role.position
    )
      return interaction.reply({
        content:
          '`❌` 自分の持つロールより上のロールを追加することはできません。',
      });

    const button = new ButtonBuilder()
      .setCustomId(`nonick-js:roleButton-${role.id}`)
      .setStyle(interaction.message.components[0].components[1].style);

    if (emoji) {
      if (displayName) button.setLabel(displayName);
      button.setEmoji(emoji);
    } else button.setLabel(displayName || role.name);

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
    if (
      targetMessage.components.some((v) => {
        if (v.type !== ComponentType.ActionRow) return false;
        return v.components
          .map((i) => i.customId)
          .includes(`nonick-js:roleButton-${role.id}`);
      })
    )
      return interaction.reply({
        content: '`❌` そのロールのボタンは既に追加されています。',
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

    // Check Permission
    const dangerPermissions = getDangerPermission(role);

    if (dangerPermissions.length) {
      const message = await interaction.update({
        content: null,
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0])
            .setTitle('`⚠️` 注意！')
            .setDescription(
              [
                `${role}には潜在的に危険な権限があります。`,
                '**本当にこのロールを追加しますか？**',
                '',
                `> ${permToText(...dangerPermissions)
                  .map((v) => inlineCode(v))
                  .join(' ')}`,
              ].join('\n'),
            )
            .setColor(Colors.Yellow),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('nonick-js:embedMaker-roleButton-send-agree')
              .setLabel('はい')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('nonick-js:embedMaker-roleButton-send-disagree')
              .setLabel('いいえ')
              .setStyle(ButtonStyle.Danger),
          ),
        ],
      });

      message
        .awaitMessageComponent({
          filter: (v) =>
            /^nonick-js:embedMaker-roleButton-send-(agree|disagree)$/.test(
              v.customId,
            ),
          componentType: ComponentType.Button,
          time: 180_000,
        })
        .then(async (i) => {
          if (i.customId === 'nonick-js:embedMaker-roleButton-send-disagree')
            return i.update({ embeds, components });

          await i.update({
            content: '`⌛` コンポーネントを追加中...',
            embeds: [],
            components: [],
          });
          await webhook.edit({ channel: i.channelId });
          webhook
            .editMessage(targetMessage, { components: updatedComponents })
            .then(() =>
              i.editReply({
                content: '`✅` コンポーネントを追加しました！',
                embeds,
                components,
              }),
            )
            .catch(() =>
              i.editReply({
                content: '`❌` コンポーネントの更新中に問題が発生しました。',
                embeds,
                components,
              }),
            );
        })
        .catch(() => {});
    } else {
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
    }
  },
);

module.exports = [sendRoleButton, sendRoleButtonModal];
