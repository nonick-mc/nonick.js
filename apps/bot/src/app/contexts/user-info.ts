import { ApplicationCommandType, MessageFlags } from 'discord.js';
import { ContextMenu, execute } from 'sunar';
import { getUserInfoComponent } from '@/features/user-info.js';

export const contextMenu = new ContextMenu({
  name: 'このユーザーの情報',
  type: ApplicationCommandType.User,
  dmPermission: false,
});

execute(contextMenu, async (interaction) => {
  if (interaction.inCachedGuild()) {
    interaction.reply({
      components: [await getUserInfoComponent(interaction.targetUser, interaction.targetMember)],
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    });
  } else {
    interaction.reply({
      components: [await getUserInfoComponent(interaction.targetUser)],
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    });
  }
});
