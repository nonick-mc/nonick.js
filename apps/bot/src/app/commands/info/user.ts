import { ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import { execute, SlashSubcommand } from 'sunar';
import { getUserInfoComponent } from '@/features/user-info.js';

export const slash = new SlashSubcommand('info', {
  name: 'user',
  description: 'ユーザーの情報を確認',
  options: [
    {
      name: 'user',
      description: 'ユーザー',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
});

execute(slash, async (interaction) => {
  const user = interaction.options.getUser('user', true);
  const member = await interaction.guild?.members.fetch(user.id).catch(() => undefined);

  interaction.reply({
    components: [await getUserInfoComponent(user, member)],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  });
});
