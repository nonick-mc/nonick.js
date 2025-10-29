import { Events } from 'discord.js';
import { autoCreateThreadHolder } from '@/constants/holder';
import { db } from '@/modules/drizzle';
import { DiscordEventBuilder } from '@/modules/events';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;

    const rule = await db.query.autoCreateThreadRule.findFirst({
      where: (rule, { eq, and }) =>
        and(eq(rule.guildId, message.guildId), eq(rule.channelId, message.channelId)),
    });

    if (!rule?.enabled) return;
    if (rule.ignoreRoles.some((role) => message.member?.roles.cache.has(role))) return;

    const threadName = autoCreateThreadHolder.parse(rule.threadName, {
      member: message.member,
      user: message.author,
      createdAt: message.createdAt,
    });

    message.startThread({
      name: threadName.length > 100 ? `${threadName.slice(0, 97)}...` : threadName,
      autoArchiveDuration: rule.autoArchiveDuration,
      reason: '自動スレッド作成',
    });
  },
});
