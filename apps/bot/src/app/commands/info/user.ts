import {
  ApplicationCommandOptionType,
  type InteractionReplyOptions,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { execute, SlashSubcommand } from 'sunar';
import { getMemberInfoContainers, getUserInfoContainer } from '@/src/modules/user-info';

export const slashSubCommand = new SlashSubcommand('info', {
  name: 'user',
  description: 'ユーザーの情報を表示します',
  options: [
    {
      name: 'user',
      description: 'ユーザー',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
});

execute(slashSubCommand, async (interaction) => {
  const targetUser = interaction.options.getUser('user', true);
  const options: InteractionReplyOptions = {
    allowedMentions: {},
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  };

  if (!interaction.inCachedGuild()) {
    return await interaction.reply({
      components: [getUserInfoContainer(targetUser)],
      ...options,
    });
  }

  const targetMember = await interaction.guild.members.fetch(targetUser).catch(() => null);
  const isMember = !!targetMember;

  await interaction.reply({
    components: isMember
      ? getMemberInfoContainers(
          targetMember,
          interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers),
        )
      : [getUserInfoContainer(targetUser)],
    ...options,
  });
});
