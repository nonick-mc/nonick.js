import { SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { Colors, EmbedBuilder, MessageFlags } from 'discord.js';

const roleSelect = new SelectMenu(
  {
    customId: /^nonick-js:roleSelectMenu(-[1-5])?$|^reactionRole$/,
    type: SelectMenuType.String,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;
    if (interaction.message.flags.has(MessageFlags.Ephemeral))
      return interaction.update({});

    await interaction.deferReply({ ephemeral: true });

    const roles = interaction.member.roles;
    let error = false;

    await roles
      .remove(
        interaction.component.options
          .map((opt) => opt.value)
          .filter((opt) => !interaction.values.includes(opt)),
      )
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      .catch(() => (error = true));
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    await roles.add(interaction.values).catch(() => (error = true));

    if (error)
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setDescription('`❌` 一部ロールが付与/解除できませんでした。')
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      });

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setDescription('`✅` ロールを更新しました！')
          .setColor(Colors.Green),
      ],
      ephemeral: true,
    });

    setTimeout(() => interaction.deleteReply(), 3_000);
  },
);

module.exports = [roleSelect];
