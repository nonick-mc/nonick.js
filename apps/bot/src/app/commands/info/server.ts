import { stripIndents } from 'common-tags';
import {
  ContainerBuilder,
  HeadingLevel,
  heading,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from 'discord.js';
import { execute, SlashSubcommand } from 'sunar';
import { defaultColor, other } from '@/constants/emojis.js';
import { countField, idField, scheduleField, userField } from '@/lib/fields.js';

export const slash = new SlashSubcommand('info', {
  name: 'server',
  description: 'このサーバーの情報を確認',
});

execute(slash, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(heading(interaction.guild.name, HeadingLevel.Three)),
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(false));

  const infoTextDisplay = new TextDisplayBuilder().setContent(stripIndents`
    ${idField('サーバーID', interaction.guildId)}
    ${userField('オーナー', (await interaction.guild.fetchOwner()).user)}
    ${countField('メンバー数', interaction.guild.memberCount, defaultColor.usersRound)}
    ${countField('チャンネル数', interaction.guild.channels.channelCountWithoutThreads, defaultColor.hash)}
    ${scheduleField('作成日', interaction.guild.createdAt)}
    ${countField('ブースト数', interaction.guild.premiumSubscriptionCount ?? 0, other.boost)}
  `);

  const iconURL = interaction.guild.iconURL();

  if (iconURL) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(infoTextDisplay)
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(iconURL)),
    );
  } else {
    container.addTextDisplayComponents(infoTextDisplay);
  }

  return interaction.reply({
    components: [container],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
    allowedMentions: { roles: [], users: [] },
  });
});
