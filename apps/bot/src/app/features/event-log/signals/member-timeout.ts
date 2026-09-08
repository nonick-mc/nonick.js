import {
  AuditLogEvent,
  Colors,
  ContainerBuilder,
  Events,
  type GuildAuditLogsEntry,
  HeadingLevel,
  heading,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  unorderedList,
} from 'discord.js';
import { execute, Signal } from 'sunar';
import { Default, Destructive, getAppEmoji, Primary } from '@/src/constants/emoji';
import { db } from '@/src/lib/db';
import { reasonField, timeField, userField } from '@/src/lib/format';
import { sendEventLog } from '../send-log';

export const signal = new Signal(Events.GuildAuditLogEntryCreate);

execute(signal, async (auditLogEntry, guild) => {
  if (auditLogEntry.action !== AuditLogEvent.MemberUpdate) return;

  const { changes, executor, target, reason } =
    auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.MemberUpdate>;
  const change = changes.find((c) => c.key === 'communication_disabled_until');
  if (!change) return;
  if (!executor || !target) return;

  const newValue = change.new as string | undefined;
  const isCancel = !newValue || Date.parse(newValue) <= Date.now();

  const resolvedTarget = target.partial ? await target.fetch() : target;
  const resolvedExecutor = executor.partial ? await executor.fetch() : executor;

  const setting = await db.query.timeoutLogSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });

  const components = isCancel
    ? [
        new ContainerBuilder()
          .setAccentColor(Colors.Blue)
          .addSectionComponents(
            new SectionBuilder()
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(resolvedTarget.displayAvatarURL()),
              )
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  heading(`${getAppEmoji(Primary.clock)} タイムアウト手動解除`, HeadingLevel.Three),
                ),
                new TextDisplayBuilder().setContent(
                  unorderedList([
                    userField(Default.userRound, '対象者', resolvedTarget),
                    userField(Primary.userRoundPen, '実行者', resolvedExecutor),
                  ]),
                ),
              ),
          ),
      ]
    : [
        new ContainerBuilder()
          .setAccentColor(Colors.Red)
          .addSectionComponents(
            new SectionBuilder()
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(resolvedTarget.displayAvatarURL()),
              )
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  heading(`${getAppEmoji(Destructive.clock)} タイムアウト`, HeadingLevel.Three),
                ),
                new TextDisplayBuilder().setContent(
                  unorderedList([
                    userField(Default.userRound, '対象者', resolvedTarget),
                    timeField(Default.calendarClock, '解除される時間', newValue, true),
                    userField(Primary.userRoundPen, '実行者', resolvedExecutor),
                    reasonField(Primary.messageSquareText, '理由', reason),
                  ]),
                ),
              ),
          ),
      ];
  await sendEventLog(guild, setting, { components }, auditLogEntry.executorId);
});
