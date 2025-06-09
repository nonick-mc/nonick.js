import { ActionRowBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';

const button = new Button(
  { customId: 'nonick-js:embedMaker-export' },
  (interaction) => {
    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-exportModal')
        .setTitle('エクスポート')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('fileName')
              .setLabel('ファイルの名前 (日本語は使用できません)')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );
  },
);

const modal = new Modal(
  { customId: 'nonick-js:embedMaker-exportModal' },
  async (interaction) => {
    if (!interaction.isFromMessage()) return;

    await interaction.deferReply({ ephemeral: true });
    const fileName = interaction.fields.getTextInputValue('fileName') || `nonick-js_embed_${interaction.message.id}`;

    interaction
      .followUp({
        content: '`✅` 現在の埋め込みをエクスポートしました。`/embed import`を使用して読み込ませることが出来ます。',
        files: [new AttachmentBuilder(Buffer.from(JSON.stringify(interaction.message.embeds, null, 2)), { name: `${fileName}.json` })],
      })
      .catch(() => {
        interaction.followUp({ content: '`❌` エクスポート中に問題が発生しました。', ephemeral: true });
      });
  },
);

module.exports = [button, modal];