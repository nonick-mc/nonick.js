import { blurple, red } from '@const/emojis';
import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { scheduleField, textField, userField } from '@modules/fields';
import { formatEmoji, getSendableChannel } from '@modules/util';
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  type GuildAuditLogsEntry,
  inlineCode,
  time,
} from 'discord.js';
import { sendLogToRelatedReport } from './_function';

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    if (auditLogEntry.action !== AuditLogEvent.MemberUpdate) return;
    const timeoutChange = auditLogEntry.changes.find(
      (v) => v.key === 'communication_disabled_until',
    );
    if (!timeoutChange) return;
    const { executor, target, reason } =
      auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.MemberUpdate>;
    if (!(executor && target)) return;
    const fetchedExecutor = await executor.fetch();
    const member = await guild.members
      .fetch(await target.fetch())
      .catch(() => null);
    if (!member) return;

    const isCancel =
      Date.parse((timeoutChange.new ?? 0) as string) <= Date.now();
    const setting = await db.query.timeoutLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guild.id),
    });

    sendLogToRelatedReport(guild, member.user, null, {
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: fetchedExecutor.username,
            iconURL: fetchedExecutor.displayAvatarURL(),
          })
          .setDescription(
            isCancel
              ? `${formatEmoji(blurple.time)} ${member.user}のタイムアウトを解除しました`
              : `${formatEmoji(red.time)} ${member.user}を${time(new Date(member.communicationDisabledUntil ?? 0))}までタイムアウトしました`,
          )
          .setColor(isCancel ? Colors.Blue : null)
          .setTimestamp(),
      ],
    });

    if (!setting?.enabled || !setting.channel) return;

    const channel = await getSendableChannel(guild, setting.channel).catch(
      () => null,
    );
    if (!channel) return;

    const field = [
      userField(await target.fetch(), { label: '対象者' }),
      scheduleField(member.communicationDisabledUntil ?? 0, {
        label: '解除される時間',
      }),
      '',
      userField(fetchedExecutor, {
        label: '実行者',
        color: 'blurple',
      }),
      textField(reason ?? '理由が入力されてません', {
        label: '理由',
        color: 'blurple',
      }),
    ];
    if (isCancel) field.splice(1, 1);

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${inlineCode('🛑')} タイムアウト${isCancel ? '解除' : ''}`)
          .setDescription(field.join('\n'))
          .setColor(isCancel ? Colors.Blue : Colors.Red)
          .setThumbnail(target.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
});
