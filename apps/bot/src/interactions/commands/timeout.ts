import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  bold,
  codeBlock,
  inlineCode,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'timeout',
    description: 'ユーザーをタイムアウト (公式の機能より柔軟な設定が可能)',
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
  },
  { coolTime: Duration.toMS('5s') },
  (interaction) => {
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
        content: `${inlineCode('❌')} 合計時間は1分以上から設定できます`,
        ephemeral: true,
      });
    if (Duration.toMS('28d') < duration)
      return interaction.reply({
        content: `${inlineCode('❌')} 28日以上のタイムアウトはできません`,
        ephemeral: true,
      });
    if (!(member instanceof GuildMember))
      return interaction.reply({
        content: `${inlineCode('❌')} このユーザーはサーバーにいません`,
        ephemeral: true,
      });
    if (member.user.equals(interaction.user))
      return interaction.reply({
        content: `${inlineCode('❌')} 自分自身を対象にすることはできません`,
        ephemeral: true,
      });
    if (!member.moderatable)
      return interaction.reply({
        content: `${inlineCode('❌')} このユーザーをタイムアウトする権限がありません`,
        ephemeral: true,
      });
    if (
      interaction.guild.ownerId !== interaction.user.id &&
      interaction.member.roles.highest.position < member.roles.highest.position
    )
      return interaction.reply({
        content: `${inlineCode('❌')} このユーザーをタイムアウトする権限がありません`,
        ephemeral: true,
      });

    member
      .timeout(
        duration,
        `${
          interaction.options.getString('reason') ?? '理由が入力されていません'
        } - ${interaction.user.tag}`,
      )
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${inlineCode('✅')} ${member}を${Duration.format(
                  duration,
                  `${bold('%{d}')}日${bold('%{h}')}時間${bold('%{m}')}分`,
                )}タイムアウトしました`,
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                [
                  `${inlineCode('❌')} タイムアウトに失敗しました`,
                  codeBlock(err),
                ].join('\n'),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      });
  },
);
