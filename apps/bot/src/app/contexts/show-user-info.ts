import {
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { ContextMenu, execute } from 'sunar';
import { getMemberInfoContainers, getUserInfoContainer } from '@/src/modules/user-info';

const context = new ContextMenu({
  name: 'このユーザーの情報',
  type: ApplicationCommandType.User,
  integrationTypes: [ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild],
});

execute(context, async (interaction) => {
  if (!interaction.inCachedGuild()) return;
  const isMember = !!interaction.targetMember;

  await interaction.reply({
    components: isMember
      ? getMemberInfoContainers(
          interaction.targetMember,
          interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers),
        )
      : [getUserInfoContainer(interaction.targetUser)],
    allowedMentions: {
      users: [],
    },
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  });
});
