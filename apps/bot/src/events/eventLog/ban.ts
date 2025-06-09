import { blurple, red } from '@const/emojis';
import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { textField, userField } from '@modules/fields';
import { formatEmoji, getSendableChannel } from '@modules/util';
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  type GuildAuditLogsEntry,
  inlineCode,
} from 'discord.js';
import { sendLogToRelatedReport } from './_function';

const state = [
  AuditLogEvent.MemberBanAdd,
  AuditLogEvent.MemberBanRemove,
] as const;

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    if (!isBanLog(auditLogEntry)) return;
    const { executor, target, reason, actionType } = auditLogEntry;
    if (!(executor && target)) return;
    const fetchedTarget = await target.fetch();
    const fetchedExecutor = await executor.fetch();
    const isCancel = actionType === 'Create';
    const setting = await db.query.banLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guild.id),
    });

    sendLogToRelatedReport(guild, fetchedTarget, null, {
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: fetchedExecutor.username,
            iconURL: fetchedExecutor.displayAvatarURL(),
          })
          .setDescription(
            isCancel
              ? `${formatEmoji(blurple.hammer)} ${fetchedTarget}をBAN解除しました`
              : `${formatEmoji(red.hammer)} ${fetchedTarget}をBANしました`,
          )
          .setColor(isCancel ? Colors.Blue : null)
          .setTimestamp(),
      ],
    });

    if (!(setting?.enabled && setting.channel)) return;
    const channel = await getSendableChannel(guild, setting.channel).catch(
      () => null,
    );
    if (!channel) return;

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${inlineCode('🔨')} BAN${isCancel ? '解除' : ''}`)
          .setDescription(
            [
              userField(fetchedTarget, { label: '対象者' }),
              '',
              userField(await executor.fetch(), {
                label: '実行者',
                color: 'blurple',
              }),
              textField(reason ?? '理由が入力されてません', {
                label: '理由',
                color: 'blurple',
              }),
            ].join('\n'),
          )
          .setColor(isCancel ? Colors.Blue : Colors.Red)
          .setThumbnail(target.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
});

function isBanLog(
  entry: GuildAuditLogsEntry,
): entry is GuildAuditLogsEntry<(typeof state)[number]> {
  return (state as unknown as AuditLogEvent[]).includes(entry.action);
}
