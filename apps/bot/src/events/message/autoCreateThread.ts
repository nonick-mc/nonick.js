import { ChannelType, Events } from 'discord.js';
import { autoCreateThreadHolder } from '@/constants/holder';
import { db } from '@/modules/drizzle';
import { DiscordEventBuilder } from '@/modules/events';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (
      !message.inGuild() ||
      message.channel.type !== ChannelType.GuildText ||
      message.system ||
      message.author.id === message.client.user.id
    )
      return;

    const rule = await db.query.autoCreateThreadRule.findFirst({
      where: (rule, { eq, and }) =>
        and(eq(rule.guildId, message.guildId), eq(rule.channelId, message.channelId)),
    });
    if (!rule?.enabled) return;

    // 例外設定の参照
    if (rule.ignoreRoles.some((role) => message.member?.roles.cache.has(role))) return;
    if (rule.ignoreBot && message.author.bot) return;

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
