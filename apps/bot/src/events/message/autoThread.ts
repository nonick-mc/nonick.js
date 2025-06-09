import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    const setting = await db.query.autoCreateThreadSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, message.guildId),
    });

    if (!setting?.enabled) return;
    if (!setting.channels.includes(message.channel.id)) return;

    message.startThread({
      name: `${message.author.displayName}のスレッド`,
      reason: 'auto thread create',
    });
  },
});
