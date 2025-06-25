import { ChatInput } from '@akki256/discord-interaction';
import { levels } from '@repo/database';
import {
  ApplicationCommandOptionType,
  bold,
  ContainerBuilder,
  hyperlink,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from 'discord.js';
import { white } from '@/constants/emojis';
import { dashboard } from '@/constants/links';
import { db } from '@/modules/drizzle';
import { userField } from '@/modules/fields';
import { formatEmoji } from '@/modules/util';

const setBoost = new ChatInput(
  {
    name: 'setboost',
    description: 'ブースト率を変更します',
    options: [
      {
        name: 'user',
        description: 'ブースト率を変更するユーザー',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'boost',
        description: 'ブースト率 (1 = 100%)',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await db.query.levelSystemSettings.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting || !setting.enabled) {
      return interaction.reply({
        content: `\`❌\` このコマンドを使用するためには、ダッシュボードで${hyperlink('レベルシステムを有効', `<${dashboard}/guilds/${interaction.guild.id}/levels>`)}にする必要があります。`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    const user = interaction.options.getUser('user', true);
    const boost = interaction.options.getNumber('boost', true);

    const beforeLevelData = await db.query.levels.findFirst({
      where: (data, { eq, and }) =>
        and(eq(data.guildId, interaction.guildId), eq(data.userId, user.id)),
    });

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const res = (
      await db
        .insert(levels)
        .values({
          guildId: interaction.guildId,
          userId: user.id,
          boost,
        })
        .onConflictDoUpdate({
          target: [levels.guildId, levels.userId],
          set: { boost },
        })
        .returning()
        .catch(() => [null])
    )[0];

    if (!res) {
      return interaction.editReply({
        content: `\`❌\` ${user}の経験値倍率の変更に失敗しました。`,
      });
    }

    interaction.editReply({
      content: `\`✅\` ${user}の経験値倍率の変更に成功しました。`,
    });

    // ログ送信
    if (!setting?.enableLog || !setting.logChannel) return;
    const channel = await interaction.guild.channels.fetch(setting.logChannel).catch(() => null);
    if (!(channel?.isTextBased() && channel.isSendable)) return;

    channel.send({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(`## ${formatEmoji(white.role2)} 経験値倍率変更`),
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
                    `${formatEmoji(white.setting)} ${bold('変更前:')} ${beforeLevelData?.boost || 1}`,
                    `${formatEmoji(white.setting)} ${bold('変更後:')} ${res.boost}`,
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

export default [setBoost];
