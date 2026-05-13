import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  HeadingLevel,
  heading,
  inlineCode,
  MessageFlags,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  TimestampStyles,
  time,
} from 'discord.js';
import { execute, SlashSubcommand } from 'sunar';
import { unorderedListTable } from '@/src/lib/format';

export const slashSubCommand = new SlashSubcommand('info', {
  name: 'server',
  description: 'サーバーの情報を表示します',
});

execute(slashSubCommand, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const container = new ContainerBuilder().addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      heading(`${interaction.guild.name} の情報`, HeadingLevel.Three),
    ),
  );

  const owner = await interaction.guild.fetchOwner();
  const guildInfoTextDisplay = new TextDisplayBuilder().setContent(
    unorderedListTable([
      {
        label: 'サーバーID',
        value: inlineCode(interaction.guildId),
      },
      {
        label: '所有者',
        value: `${owner} ${inlineCode(owner.user.username)}`,
      },
      {
        label: 'メンバー数',
        value: inlineCode(interaction.guild.memberCount.toString()),
      },
      {
        label: 'チャンネル数',
        value: inlineCode(interaction.guild.channels.channelCountWithoutThreads.toString()),
      },
      {
        label: 'ブースト数',
        value: inlineCode((interaction.guild.premiumSubscriptionCount ?? 0).toString()),
      },
      {
        label: 'サーバー作成日',
        value: time(interaction.guild.createdAt, TimestampStyles.LongDate),
      },
    ]),
  );

  if (interaction.guild.icon) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(guildInfoTextDisplay)
        .setThumbnailAccessory(
          new ThumbnailBuilder().setURL(interaction.guild.iconURL() as string),
        ),
    );
  } else {
    container.addTextDisplayComponents(guildInfoTextDisplay);
  }

  container.addActionRowComponents(
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('show-guild-features')
        .setLabel('機能一覧')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('show-guild-roles')
        .setLabel('ロール一覧')
        .setStyle(ButtonStyle.Secondary),
    ),
  );

  interaction.reply({
    components: [container],
    allowedMentions: { users: [] },
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  });
});
