import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { ChannelType, Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {
    if (
      !message.inGuild() ||
      message.author.bot ||
      message.system ||
      message.channel.type !== ChannelType.GuildAnnouncement
    )
      return;
    const setting = await db.query.autoPublicSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, message.guildId),
    });

    if (!setting?.enabled) return;
    if (!setting.channels.includes(message.channel.id)) return;

    if (!message.crosspostable) return;
    message
      .crosspost()
      .catch(() => message.reply('`❌` メッセージの公開に失敗しました'));
  },
});
