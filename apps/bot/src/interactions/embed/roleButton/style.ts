import { Button } from '@akki256/discord-interaction';
import {
  type ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonComponent,
} from 'discord.js';

const button = new Button(
  { customId: 'nonick-js:embedMaker-roleButton-changeStyle' },
  (interaction) => {
    const newStyle =
      interaction.component.style + 1 === 5
        ? 1
        : interaction.component.style + 1;
    const newEditButtons = ActionRowBuilder.from<ButtonBuilder>(
      interaction.message.components[0] as ActionRow<ButtonComponent>,
    );

    newEditButtons.components.splice(
      1,
      1,
      ButtonBuilder.from(interaction.component).setStyle(newStyle),
    );

    interaction.update({ content: null, components: [newEditButtons] });
  },
);

module.exports = [button];
