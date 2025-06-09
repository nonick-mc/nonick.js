import { Button } from '@akki256/discord-interaction';
import {
  ActionRowBuilder,
  ComponentType,
  StringSelectMenuBuilder,
} from 'discord.js';
import { getRoleSelectMakerButtons } from './_function';

const changeSelectMode = new Button(
  { customId: /^nonick-js:embedMaker-selectRole-selectMode-(single|multi)$/ },
  (interaction) => {
    if (interaction.message.components[0].type !== ComponentType.ActionRow)
      return;
    const select = interaction.message.components[0].components[0];
    const isSingleMode =
      interaction.customId ===
      'nonick-js:embedMaker-selectRole-selectMode-single';

    if (select.type !== ComponentType.StringSelect) return;

    const newSelect = StringSelectMenuBuilder.from(select).setMaxValues(
      isSingleMode ? select.options.length : 1,
    );

    interaction.update({
      content: null,
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          newSelect,
        ),
        getRoleSelectMakerButtons(newSelect.toJSON()),
      ],
    });
  },
);

module.exports = [changeSelectMode];
