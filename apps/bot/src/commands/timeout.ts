import { oneLineTrim } from 'common-tags';
import {
  ApplicationCommandOptionType,
  GuildMember,
  MessageFlags,
  PermissionFlagsBits,
  TimestampStyles,
  time,
} from 'discord.js';
import { execute, Slash } from 'sunar';
import { danger, getBotEmoji, success } from '@/constants/emojis.js';
import { Duration } from '@/lib/format.js';

export const slash = new Slash({
  name: 'timeout',
  description: 'ユーザーをタイムアウト',
  options: [
    {
      name: 'user',
      description: 'ユーザー',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'date',
      description: '日',
      type: ApplicationCommandOptionType.Number,
    },
    {
      name: 'hour',
      description: '時',
      type: ApplicationCommandOptionType.Number,
    },
    {
      name: 'minute',
      description: '分',
      type: ApplicationCommandOptionType.Number,
    },
    {
      name: 'reason',
      description: '理由',
      type: ApplicationCommandOptionType.String,
    },
  ],
  defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
  dmPermission: false,
});

execute(slash, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const member = interaction.options.getMember('user');
  const duration = Duration.toMS(
    [
      `${interaction.options.getNumber('date') ?? 0}d`,
      `${interaction.options.getNumber('hour') ?? 0}h`,
      `${interaction.options.getNumber('minute') ?? 0}m`,
    ].join(''),
  );

  if (duration <= 0)
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} 合計時間は1分以上から設定できます。`,
      flags: [MessageFlags.Ephemeral],
    });
  if (Duration.toMS('28d') < duration)
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} 28日以上のタイムアウトはできません。`,
      flags: [MessageFlags.Ephemeral],
    });

  if (!(member instanceof GuildMember))
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} このユーザーはサーバーにいません。`,
      flags: [MessageFlags.Ephemeral],
    });
  if (member.user.id === interaction.user.id)
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} 自分自身を対象にすることはできません。`,
      flags: [MessageFlags.Ephemeral],
    });
  if (!member.moderatable) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} NoNICK.jsに${member}をタイムアウトする権限がありません。`,
      flags: [MessageFlags.Ephemeral],
    });
  }
  if (
    interaction.guild.ownerId !== interaction.user.id &&
    interaction.member.roles.highest.position < member.roles.highest.position
  )
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} ${interaction.user}に${member}をタイムアウトする権限がありません。`,
      flags: [MessageFlags.Ephemeral],
    });

  member
    .timeout(
      duration,
      `${interaction.options.getString('reason') ?? '理由が入力されていません'} - ${interaction.user.tag}`,
    )
    .then((afterMember) => {
      interaction.reply({
        content: oneLineTrim`
          ${getBotEmoji(success.circleCheck)} ${member}を
          ${time(afterMember.communicationDisabledUntil ?? new Date(), TimestampStyles.ShortDateTime)}
          までタイムアウトしました。
        `,
        flags: [MessageFlags.Ephemeral],
      });
    })
    .catch((err) => {
      console.error(err);
      interaction.reply({
        content: `${getBotEmoji(danger.circleX)} タイムアウトに失敗しました。`,
        flags: [MessageFlags.Ephemeral],
      });
    });
});
