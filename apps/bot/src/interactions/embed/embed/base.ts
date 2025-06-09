import { Button, Modal } from '@akki256/discord-interaction';
import { document } from '@const/links';
import { isURL } from '@modules/util';
import {
  ActionRowBuilder,
  type ColorResolvable,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  resolveColor,
} from 'discord.js';
import { reloadEmbedMaker } from './_function';

const button = new Button(
  { customId: 'nonick-js:embedMaker-base' },
  (interaction) => {
    const embed = interaction.message.embeds[0];

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-baseModal')
        .setTitle('タイトル・説明・色')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('タイトル')
              .setValue(embed.title || '')
              .setMaxLength(256)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('url')
              .setLabel('タイトルURL')
              .setValue(embed.url || '')
              .setPlaceholder(`例）${document}`)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('説明')
              .setValue(embed.description || '')
              .setMaxLength(3999)
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('color')
              .setLabel('カラーコード (または色の名前)')
              .setValue(embed.hexColor || '')
              .setPlaceholder('例）#ffffff, Red')
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );
  },
);

const modal = new Modal(
  { customId: 'nonick-js:embedMaker-baseModal' },
  (interaction) => {
    if (!interaction.isFromMessage()) return;

    const title = interaction.fields.getTextInputValue('title') || null;
    const url = interaction.fields.getTextInputValue('url') || null;
    const description =
      interaction.fields.getTextInputValue('description') || null;
    let color: string | number = interaction.fields.getTextInputValue('color');

    if (url && !isURL(url))
      return interaction.reply({
        content:
          '`❌` `http://`または`https://`から始まるURLを入力してください。',
        ephemeral: true,
      });

    try {
      color = resolveColor(color as ColorResolvable);
    } catch {
      return interaction.reply({
        content:
          '`❌` 無効なカラーコード、または色の名前が入力されました。[このページ](https://docs.nonick-js.com/nonick.js/features/embed/)を参考に正しい値を入力してください。',
        ephemeral: true,
      });
    }

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
      .setTitle(title)
      .setURL(url)
      .setDescription(description)
      .setColor(color);

    reloadEmbedMaker(interaction, embed.toJSON());
  },
);

module.exports = [button, modal];
