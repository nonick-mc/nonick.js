import { type levelSystemSettings, levels } from '@repo/database';
import { Events, type Message } from 'discord.js';
import { levelUpMessageHolder } from '@/constants/holder';
import { db } from '@/modules/drizzle';
import { DiscordEventBuilder } from '@/modules/events';
import { Duration } from '@/modules/format';
import { getBoost, getExp, getRewardLevel, merge, validate } from '@/modules/level';

const base = new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    const setting = await db.query.levelSystemSettings.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, message.guildId),
    });

    if (!setting || !setting.enabled) return;
    if (!validate(message, setting)) return;
    if (!message.member) return;

    const beforeLevelData = await db.query.levels.findFirst({
      where: (levels, { eq, and }) =>
        and(eq(levels.guildId, message.guildId), eq(levels.userId, message.author.id)),
    });
    if (beforeLevelData && beforeLevelData.updatedAt.getTime() > Date.now() - Duration.toMS('1m'))
      return;

    const { level, xp } = merge(
      { level: beforeLevelData?.level || 0, xp: beforeLevelData?.xp || 0 },
      Math.floor(getExp(getBoost(message.member, setting.boosts)) * (beforeLevelData?.boost || 1)),
    );

    const res = (
      await db
        .insert(levels)
        .values({
          guildId: message.guildId,
          userId: message.author.id,
          level,
          xp,
        })
        .onConflictDoUpdate({
          target: [levels.guildId, levels.userId],
          set: { level, xp },
        })
        .returning()
    )[0];

    if (!(res.level - (beforeLevelData?.level || 0) >= 1)) return;
    const channel = await getLevelUpNotificationChannel(message, setting);
    if (!channel?.isTextBased()) return;

    channel.send(
      levelUpMessageHolder.parse(setting.levelUpNotificationMessage, {
        user: message.author,
        level,
        xp,
      }),
    );

    const { current, before } = getRewardLevel(res.level, setting.rewards);
    if (!current || current.level <= (beforeLevelData?.level || 0)) return;
    const role = await message.guild.roles.fetch(current.role);
    if (!role) return;

    if (before && current.mode === 'replace-previous') {
      await message.member.roles.remove(before.role, 'ランクアップ');
    }
    await message.member.roles.add(current.role, 'ランクアップ');
  },
});

async function getLevelUpNotificationChannel(
  message: Message<true>,
  setting: typeof levelSystemSettings.$inferSelect,
) {
  switch (setting.levelUpNotificationMode) {
    case 'current':
      return message.channel;
    case 'specified':
      // biome-ignore lint: false positive
      return await message.guild.channels.fetch(setting.levelUpNotificationChannel!);
  }
}

export default [base];
