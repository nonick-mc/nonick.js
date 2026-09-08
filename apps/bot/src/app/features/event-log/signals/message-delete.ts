import {
  AuditLogEvent,
  ContainerBuilder,
  Events,
  type Guild,
  HeadingLevel,
  heading,
  type Message,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  subtext,
  TextDisplayBuilder,
  ThumbnailBuilder,
  type User,
  unorderedList,
} from 'discord.js';
import { execute, Signal } from 'sunar';
import { addMessageContent } from '@/src/app/shared/message-content';
import { Default, Destructive, getAppEmoji, Primary } from '@/src/constants/emoji';
import { db } from '@/src/lib/db';
import { channelField, timeField, userField } from '@/src/lib/format';
import { sendEventLog } from '../send-log';

export const signal = new Signal(Events.MessageDelete);

execute(signal, async (message) => {
  const guild = message.guild;
  if (!guild) return;
  if (message.partial) return;

  const setting = await db.query.msgDeleteLogSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });

  const executor = await resolveExecutor(guild, message);

  const container = new ContainerBuilder()
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(message.author.displayAvatarURL()))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            heading(`${getAppEmoji(Destructive.trash2)} メッセージ削除`, HeadingLevel.Three),
          ),
          new TextDisplayBuilder().setContent(
            unorderedList([
              userField(Default.userRound, '送信者', message.author),
              channelField(Default.hash, 'チャンネル', message.channel),
              timeField(Default.calendarClock, '送信時刻', message.createdAt),
              userField(Primary.userRoundPen, '削除者', executor),
            ]),
          ),
        ),
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext('メッセージの内容')));

  const files = await addMessageContent(container, message);

  await sendEventLog(guild, setting, { components: [container], files }, executor.id);
});

// メッセージ削除の実行者を取得
async function resolveExecutor(guild: Guild, message: Message): Promise<User> {
  const author = message.author;

  const logs = await guild
    .fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 1 })
    .catch(() => null);
  const entry = logs?.entries.first();

  const isModeratorDelete =
    entry && // 監査ログが存在する
    entry.targetId === author.id && // 監査ログの対象がメッセージの投稿者と一致する
    entry.extra.channel.id === message.channelId && // 監査ログの対象チャンネルが、削除が発生したチャンネルと一致する
    Date.now() - entry.createdTimestamp < 5000; // 監査ログが5秒以内に作成されている

  return isModeratorDelete && entry.executor ? entry.executor.fetch() : author;
}
