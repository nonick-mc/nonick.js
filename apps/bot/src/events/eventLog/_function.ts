import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import {
  type BaseMessageOptions,
  ChannelType,
  type ForumChannel,
  type Guild,
  type Message,
  type TextChannel,
  type User,
} from 'discord.js';
import { eq } from 'drizzle-orm';

export async function sendLogToRelatedReport(
  guild: Guild,
  user: User,
  message: Message | null,
  messageOptions: BaseMessageOptions,
) {
  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });
  if (!setting?.channel || !setting.showModerateLog) return;

  const channel = (await guild.channels
    .fetch(setting.channel)
    .catch(() => null)) as TextChannel | ForumChannel | null;
  if (!channel) return;

  const reports = await db.query.report.findMany({
    where: (report, { eq, and }) =>
      and(
        eq(report.guildId, guild.id),
        eq(report.targetUserId, user.id),
        eq(report.channelId, channel.id),
        message
          ? and(
              eq(report.targetChannelId, message.channelId),
              eq(report.targetMessageId, message.id),
            )
          : undefined,
      ),
  });

  for (const r of reports) {
    const thread = await channel.threads.fetch(r.threadId).catch(() => null);
    const starterMesasge = await thread
      ?.fetchStarterMessage()
      .catch(() => null);

    if (
      !thread ||
      (channel.type === ChannelType.GuildText && !starterMesasge)
    ) {
      return await db.delete(report).where(eq(report.id, r.id));
    }
    if (!thread.isSendable()) return;

    thread.send(messageOptions);
  }
}
