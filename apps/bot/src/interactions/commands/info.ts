import { ChatInput, UserContext } from '@akki256/discord-interaction';
import { userFlag } from '@const/emojis';
import {
  countField,
  idField,
  nicknameField,
  permissionField,
  scheduleField,
  userField,
} from '@modules/fields';
import { formatEmoji, permToText } from '@modules/util';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  GuildFeature,
  PermissionFlagsBits,
  time,
} from 'discord.js';
import type {
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
  RoleManager,
  User,
  UserContextMenuCommandInteraction,
} from 'discord.js';

const featureTexts: Partial<Record<GuildFeature, string>> = {
  [GuildFeature.Partnered]: 'パートナーサーバー',
  [GuildFeature.Verified]: '認証済みサーバー',
  [GuildFeature.Discoverable]: '公開サーバー',
};

const command = new ChatInput(
  {
    name: 'info',
    description: 'info command',
    options: [
      {
        name: 'user',
        description: 'ユーザーの情報',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'user',
            description: 'ユーザー',
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: 'server',
        description: 'サーバーの情報',
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const subCommand = interaction.options.getSubcommand();

    if (subCommand === 'user')
      return interaction.reply({
        embeds: [
          await createUserInfo(
            interaction,
            interaction.options.getUser('user', true),
          ),
        ],
        ephemeral: true,
      });
    if (subCommand === 'server')
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setDescription(
              [
                idField(interaction.guild.id, { label: 'サーバーID' }),
                userField(
                  await interaction.guild.fetchOwner().then((v) => v.user),
                  { label: 'オーナー' },
                ),
                countField(interaction.guild.memberCount, {
                  emoji: 'member',
                  color: 'white',
                  label: 'メンバー数',
                }),
                countField(
                  interaction.guild.channels.channelCountWithoutThreads,
                  {
                    emoji: 'channel',
                    color: 'white',
                    label: 'チャンネル数',
                  },
                ),
                scheduleField(interaction.guild.createdAt, {
                  label: 'サーバー作成日',
                }),
                countField(interaction.guild.premiumSubscriptionCount ?? 0, {
                  emoji: 'boost',
                  color: 'white',
                  label: 'ブースト数',
                }),
              ].join('\n'),
            )
            .setColor(Colors.White)
            .setThumbnail(interaction.guild.iconURL())
            .setFields(
              {
                name: 'ステータス',
                value:
                  interaction.guild.features
                    .flatMap((feature) => featureTexts[feature] ?? [])
                    .join('\n') || 'なし',
              },
              {
                name: 'ロール',
                value: interaction.member.permissions.has(
                  PermissionFlagsBits.ManageRoles,
                )
                  ? roleList(interaction.guild.roles)
                  : permissionField(permToText('ManageRoles')),
              },
            ),
        ],
        ephemeral: true,
      });
  },
);

const context = new UserContext(
  {
    name: 'ユーザーの情報',
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    return interaction.reply({
      embeds: [await createUserInfo(interaction, interaction.targetUser)],
      ephemeral: true,
    });
  },
);
export default [command, context];

async function createUserInfo(
  interaction:
    | ChatInputCommandInteraction<'cached'>
    | UserContextMenuCommandInteraction<'cached'>,
  user: User,
) {
  const member = await interaction.guild?.members
    .fetch(user.id)
    .catch(() => null);

  const userAvatar = user.displayAvatarURL();
  const userFlags = user.flags?.toArray().flatMap((flag) => {
    const emoji = userFlag[flag];
    if (!emoji) return [];
    return formatEmoji(emoji);
  });

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.tag })
    .setTitle(member ? null : 'このユーザーはこのサーバーにはいません')
    .setDescription(
      [member ? nicknameField(member) : '', idField(user.id)]
        .filter(Boolean)
        .join('\n'),
    )
    .setColor(member ? member.displayColor || Colors.White : Colors.DarkerGrey)
    .setThumbnail(userAvatar)
    .setFields(
      {
        name: 'アカウント作成日',
        value: time(user.createdAt, 'D'),
        inline: true,
      },
      {
        name: 'バッジ',
        value: userFlags?.join(' ') || 'なし',
        inline: true,
      },
    );

  if (!member) return embed;
  embed
    .spliceFields(1, 0, {
      name: 'サーバー参加日',
      value: member.joinedAt ? time(member.joinedAt, 'D') : 'エラー',
      inline: true,
    })
    .addFields({
      name: 'ロール',
      value: roleList(member.roles),
    });

  if (member.premiumSince) {
    embed.addFields({
      name: 'ブースト開始日',
      value: `${time(member.premiumSince, 'D')} (${time(
        member.premiumSince,
        'R',
      )})`,
    });
  }

  if (
    member.isCommunicationDisabled() &&
    interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
  ) {
    embed.addFields({
      name: 'タイムアウトが解除される日時',
      value: `${time(member.communicationDisabledUntil, 'D')} (${time(
        member.communicationDisabledUntil,
        'R',
      )})`,
    });
  }

  const memberAvatar = member.displayAvatarURL();
  if (memberAvatar !== userAvatar) {
    embed
      .setAuthor({ name: user.tag, iconURL: userAvatar })
      .setThumbnail(memberAvatar);
  }
  return embed;
}

function roleList(roles: RoleManager | GuildMemberRoleManager) {
  return (
    roles.cache
      .filter((role) => role.id !== role.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .join(' ') || 'なし'
  );
}
