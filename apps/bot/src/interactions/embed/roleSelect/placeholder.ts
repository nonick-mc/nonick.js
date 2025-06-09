import { Button, Modal } from '@akki256/discord-interaction';
import {
  ActionRowBuilder,
  ComponentType,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { getRoleSelectMakerButtons } from './_function';

const selectEditButton = new Button(
  { customId: 'nonick-js:emberMaker-selectRole-placeholder' },
  (interaction) => {
    if (interaction.message?.components[0].type !== ComponentType.ActionRow)
      return;
    const select = interaction.message.components[0].components[0];
    if (select.type !== ComponentType.StringSelect) return;

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:emberMaker-selectRole-placeholderModal')
        .setTitle('セレクトメニューの編集')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('placeholder')
              .setLabel('セレクトメニューのプレースホルダー')
              .setPlaceholder('未選択時に表示される文字列')
              .setValue(select.placeholder ?? '')
              .setMaxLength(20)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );
  },
);

const selectEditModal = new Modal(
  { customId: 'nonick-js:emberMaker-selectRole-placeholderModal' },
  (interaction) => {
    if (interaction.message?.components[0].type !== ComponentType.ActionRow)
      return;
    if (
      !interaction.isFromMessage() ||
      interaction.message.components[0].components[0]?.type !==
        ComponentType.StringSelect ||
      interaction.message.components[0].components[0].customId ===
        'nonick-js:embedMaker-selectRole-removeRoleSelect'
    )
      return;

    const select = StringSelectMenuBuilder.from(
      interaction.message.components[0].components[0],
    ).setPlaceholder(interaction.fields.getTextInputValue('placeholder'));

    interaction.update({
      content: null,
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(select),
        getRoleSelectMakerButtons(select.toJSON()),
      ],
    });
  },
);

module.exports = [selectEditButton, selectEditModal];
