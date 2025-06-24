import { ChatInput } from '@akki256/discord-interaction';
import { levels } from '@repo/database';
import {
  ApplicationCommandOptionType,
  bold,
  ContainerBuilder,
  MessageFlags,
  PermissionFlagsBits,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder,
  underline,
} from 'discord.js';
import { white } from '@/constants/emojis';
import { db } from '@/modules/drizzle';
import { userField } from '@/modules/fields';
import { getNeedXP } from '@/modules/level';
import { formatEmoji, siUnit } from '@/modules/util';

const setLevel = new ChatInput(
  {
    name: 'setlevel',
    description: 'メンバーのレベル・経験値を変更します。',
    options: [
      {
        name: 'user',
        description: 'レベル・経験値を変更するユーザー',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'level',
        description: '変更後のレベル',
        type: ApplicationCommandOptionType.Integer,
        minValue: 0,
        required: true,
      },
      {
        name: 'exp',
        description: '変更後の経験値',
        type: ApplicationCommandOptionType.Integer,
        minValue: 0,
        required: true,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const user = interaction.options.getUser('user', true);
    const level = interaction.options.getInteger('level', true);
    const xp = interaction.options.getInteger('exp', true);
    const needXp = getNeedXP(xp);
    if (xp > needXp) {
      return interaction.reply({
        content: `\`❌\` 経験値の値が指定レベルでのレベルアップに必要な経験値量を超えています。レベルを${level}にする場合、経験値の値は${needXp}未満にしてください。`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const beforeLevelData = await db.query.levels.findFirst({
      where: (data, { eq, and }) =>
        and(eq(data.guildId, interaction.guildId), eq(data.userId, user.id)),
    });

    const res = (
      await db
        .insert(levels)
        .values({
          userId: user.id,
          guildId: interaction.guildId,
          level,
          xp,
        })
        .onConflictDoUpdate({
          target: [levels.userId, levels.guildId],
          set: { level, xp },
        })
        .returning()
        .catch(() => [null])
    )[0];

    if (!res) {
      return interaction.editReply({
        content: `\`❌\` ${user}のユーザーレベルの変更に失敗しました。`,
      });
    }

    interaction.editReply({
      content: `\`✅\` ${user}のユーザーレベルの変更に成功しました。`,
    });

    // ログ送信
    const setting = await db.query.levelSystemSettings.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting?.enableLog || !setting.logChannel) return;
    const channel = await interaction.guild.channels.fetch(setting.logChannel).catch(() => null);
    if (!(channel?.isTextBased() && channel.isSendable)) return;

    channel.send({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(
              `## ${formatEmoji(white.role2)} レベル・経験値変更`,
            ),
          ])
          .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
          )
          .addSectionComponents([
            new SectionBuilder()
              .addTextDisplayComponents([
                new TextDisplayBuilder().setContent(
                  [
                    userField(user, { label: '対象' }),
                    `${formatEmoji(white.setting)} ${bold('変更前:')} レベル${bold(`${beforeLevelData?.level || 0}`)} (${underline(siUnit(beforeLevelData?.xp || 0))} XP)`,
                    `${formatEmoji(white.setting)} ${bold('変更後:')} レベル${bold(`${res.level}`)} (${underline(siUnit(res.xp))} XP)`,
                    '',
                    userField(interaction.user, { color: 'blurple', label: '実行者' }),
                  ].join('\n'),
                ),
              ])
              .setThumbnailAccessory(new ThumbnailBuilder().setURL(user.displayAvatarURL())),
          ]),
      ],
      flags: [MessageFlags.IsComponentsV2],
      allowedMentions: { parse: [] },
    });
  },
);

export default [setLevel];
