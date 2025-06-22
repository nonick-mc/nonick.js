import { type levelSystemSettings, levels } from '@repo/database';
import { Events, type Message } from 'discord.js';
import { and, eq } from 'drizzle-orm';
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

    const levelData = await db.query.levels.findFirst({
      where: (levels, { eq, and }) =>
        and(eq(levels.guildId, message.guildId), eq(levels.userId, message.author.id)),
    });
    if (levelData && levelData.updatedAt.getTime() > Date.now() - Duration.toMS('1m')) return;

    // データがない場合は新規作成
    const newLevelData =
      levelData ??
      (
        await db
          .insert(levels)
          .values({ userId: message.author.id, guildId: message.guildId })
          .returning()
      )[0];

    const { level, xp } = merge(
      { level: newLevelData.level, xp: newLevelData.xp },
      Math.floor(getExp(getBoost(message.member, setting)) * newLevelData.boost),
    );

    const res = (
      await db
        .update(levels)
        .set({ level, xp })
        .where(and(eq(levels.guildId, message.guildId), eq(levels.userId, message.author.id)))
        .returning()
    )[0];

    if (res.level - newLevelData.level >= 1) return;
    const channel = await getLevelUpNotificationChannel(message, setting);
    if (!channel?.isTextBased()) return;

    channel.send(setting.levelUpNotificationMessage);

    const { current } = getRewardLevel(res.level, setting.rewards);
    if (!current || current.level <= newLevelData.level) return;
    const role = await message.guild.roles.fetch(current.role);
    if (!role) return;
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
