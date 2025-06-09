import { Button, Modal } from '@akki256/discord-interaction';
import { white } from '@const/emojis';
import {
  type APIButtonComponent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { getBaseEmbedMakerButtons, reloadEmbedMaker } from './_function';

const addField = [
  new Button(
    { customId: 'nonick-js:embedMaker-addField' },
    async (interaction) => {
      if (interaction.message.embeds[0].fields.length === 25) return;

      interaction.showModal(
        new ModalBuilder()
          .setCustomId('nonick-js:embedMaker-addFieldModal')
          .setTitle('フィールドを追加')
          .setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('name')
                .setLabel('フィールドの名前')
                .setMaxLength(256)
                .setStyle(TextInputStyle.Short),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('value')
                .setLabel('フィールドの値')
                .setMaxLength(1024)
                .setStyle(TextInputStyle.Paragraph),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('inline')
                .setLabel('インライン表示にするか')
                .setMaxLength(5)
                .setPlaceholder('trueでON、falseでOFF')
                .setStyle(TextInputStyle.Short),
            ),
          ),
      );
    },
  ),

  new Modal(
    { customId: 'nonick-js:embedMaker-addFieldModal' },
    (interaction) => {
      if (!interaction.isFromMessage()) return;

      const name = interaction.fields.getTextInputValue('name');
      const value = interaction.fields.getTextInputValue('value');
      const inline = interaction.fields.getTextInputValue('inline');

      if (!['true', 'false'].includes(inline))
        return interaction.reply({
          content: '`❌` `inline`には`true`または`false`のみ入力できます',
          ephemeral: true,
        });

      const embed = EmbedBuilder.from(interaction.message.embeds[0]).addFields({
        name,
        value,
        inline: JSON.parse(inline.toLowerCase()),
      });

      reloadEmbedMaker(interaction, embed.toJSON());
    },
  ),
];

const removeField = [
  new Button(
    { customId: 'nonick-js:embedMaker-removeField' },
    async (interaction) => {
      const embed = interaction.message.embeds[0];
      const components = interaction.message.components;

      if (embed.fields.length === 0) return;
      if (embed.fields.length === 1)
        return reloadEmbedMaker(
          interaction,
          EmbedBuilder.from(embed).setFields().data,
        );

      const indexSelectCustomId = 'nonick-js:embedMaker-removeFieldSelect';
      const backButtonCustomId =
        'nonick-js:embedMaker-selectRole-removeRoleSelect-back';

      const message = await interaction.update({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            new StringSelectMenuBuilder()
              .setCustomId(indexSelectCustomId)
              .setPlaceholder('削除する項目を選択')
              .setOptions(
                ...embed.fields.map((v, index) => ({
                  label: omitString(v.name, 100),
                  description: omitString(v.value, 100),
                  value: String(index),
                  emoji: white.message,
                })),
              ),
          ),
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId(backButtonCustomId)
              .setLabel('削除せず戻る')
              .setEmoji(white.reply)
              .setStyle(ButtonStyle.Danger),
          ),
        ],
        fetchReply: true,
      });

      message
        .awaitMessageComponent({
          filter: (v) =>
            [indexSelectCustomId, backButtonCustomId].includes(v.customId),
          time: 180_000,
        })
        .then((i) => {
          if (components[1].type !== ComponentType.ActionRow) return;

          if (i.customId === indexSelectCustomId && i.isStringSelectMenu()) {
            const newEmbed = EmbedBuilder.from(embed).setFields(
              embed.fields.filter((v, index) => Number(i.values[0]) !== index),
            );

            const newComponents = getBaseEmbedMakerButtons(newEmbed.toJSON());
            newComponents[1].addComponents(
              ButtonBuilder.from(
                components[1].components[3] as APIButtonComponent,
              ),
            );

            i.update({ embeds: [newEmbed], components: newComponents });
          } else if (i.customId === backButtonCustomId && i.isButton()) {
            const newComponents = getBaseEmbedMakerButtons(embed);
            newComponents[1].addComponents(
              ButtonBuilder.from(
                components[1].components[3] as APIButtonComponent,
              ),
            );

            i.update({ embeds: [embed], components: newComponents });
          }
        })
        .catch(() => {});
    },
  ),
];

function omitString(text: string, limit: number): string {
  return text.length > limit ? `${text.substring(0, limit - 4)} ...` : text;
}

module.exports = [...addField, ...removeField];
