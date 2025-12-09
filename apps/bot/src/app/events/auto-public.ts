import { ChannelType } from 'discord.js';
import { execute, Signal, Signals } from 'sunar';
import { danger, getBotEmoji } from '@/constants/emojis.js';
import { db } from '@/lib/drizzle.js';

export const signal = new Signal(Signals.MessageCreate);

execute(signal, async (message) => {
  if (!message.inGuild() || message.author.bot) return;
  if (message.channel.type !== ChannelType.GuildAnnouncement || !message.crosspostable) return;

  const setting = await db.query.autoPublicSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, message.guildId),
  });

  if (!setting?.enabled || !setting?.channels.includes(message.channel.id)) return;

  message
    .crosspost()
    .catch(() => message.reply(`${getBotEmoji(danger.circleX)} メッセージの公開に失敗しました`));
});
