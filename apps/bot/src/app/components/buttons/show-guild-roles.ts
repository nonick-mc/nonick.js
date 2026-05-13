import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  orderedList,
  type Role,
  TextDisplayBuilder,
} from 'discord.js';
import { Button, execute } from 'sunar';
import { Default, getAppEmojiId } from '@/src/constants/emoji';

export const button = new Button({
  id: 'show-guild-roles',
});

function createContainer(chunks: Role[][], paginationIndex: number, disabledButton = false) {
  const container = new ContainerBuilder();
  const roles = chunks[paginationIndex - 1];

  if (roles) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        orderedList(
          roles.map((role) => role.toString()),
          (paginationIndex - 1) * 10,
        ),
      ),
    );
  }

  container.addActionRowComponents(
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('left')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(getAppEmojiId(Default.arrowLeft))
        .setDisabled(disabledButton || paginationIndex < 2),
      new ButtonBuilder()
        .setCustomId('index')
        .setLabel(`${paginationIndex}/${chunks.length}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('right')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(getAppEmojiId(Default.arrowRight))
        .setDisabled(disabledButton || paginationIndex > chunks.length - 1),
    ),
  );

  return container;
}

execute(button, async (interaction) => {
  if (!interaction.inCachedGuild()) return;
  const roles = await interaction.guild.roles
    .fetch()
    .then((roles) => Array.from(roles.filter((role) => role.id !== interaction.guildId).values()));

  let index = 1;
  const chunks: Role[][] = [];
  for (let i = 0; i < roles.length; i += 15) {
    chunks.push(roles.slice(i, i + 15));
  }

  const message = await interaction.reply({
    components: [createContainer(chunks, index)],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  });
  const reply = await interaction.fetchReply();

  // Pagination
  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 5 * 60_000,
  });

  collector.on('collect', async (i) => {
    switch (i.customId) {
      case 'left':
        if (index > 1) index--;
        break;
      case 'right':
        if (index < chunks.length) index++;
        break;
    }

    await i.update({
      components: [createContainer(chunks, index)],
      allowedMentions: {},
    });
  });

  collector.on('end', async () => {
    await message.edit({
      components: [createContainer(chunks, index, true)],
    });
  });
});
