import { red } from '@const/emojis';
import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { channelField, scheduleField, userField } from '@modules/fields';
import {
  createAttachment,
  formatEmoji,
  getSendableChannel,
} from '@modules/util';
import {
  AuditLogEvent,
  Collection,
  Colors,
  EmbedBuilder,
  Events,
} from 'discord.js';
import type { GuildAuditLogsEntry, Message } from 'discord.js';
import { sendLogToRelatedReport } from './_function';

const lastLogs = new Collection<
  string,
  GuildAuditLogsEntry<AuditLogEvent.MessageDelete>
>();

export default new DiscordEventBuilder({
  type: Events.MessageDelete,
  async execute(message) {
    if (!message.inGuild()) return;
    const log = await getAuditLog(message);
    const executor = await log?.executor?.fetch().catch(() => null);
    const beforeMsg = await message.channel.messages
      .fetch({ before: message.id, limit: 1 })
      .then((v) => v.first())
      .catch(() => null);

    const setting = await db.query.msgDeleteLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, message.guild.id),
    });

    if (executor) {
      sendLogToRelatedReport(message.guild, message.author, message, {
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: executor.username,
              iconURL: executor.displayAvatarURL(),
            })
            .setDescription(
              `${formatEmoji(red.binTrash)} メッセージを削除しました`,
            )
            .setTimestamp(),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('`💬` メッセージ削除')
      .setURL(beforeMsg?.url ?? null)
      .setDescription(
        [
          channelField(message.channel),
          userField(message.author, { label: '送信者' }),
          userField(executor ?? message.author, { label: '削除者' }),
          scheduleField(message.createdAt, { label: '送信時刻' }),
        ].join('\n'),
      )
      .setFields({
        name: 'メッセージ',
        value: message.content || 'なし',
      })
      .setColor(Colors.White)
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();

    if (message.stickers.size) {
      embed.addFields({
        name: 'スタンプ',
        value: message.stickers.map((v) => v.name).join('\n'),
      });
    }

    const attachment = await createAttachment(message.attachments);

    if (!(setting?.enabled && setting.channel)) return;
    const channel = await getSendableChannel(
      message.guild,
      setting.channel,
    ).catch(() => null);

    if (!channel) return;
    if (attachment) channel.send({ embeds: [embed], files: [attachment] });
    channel.send({ embeds: [embed] });
  },
});

async function getAuditLog(message: Message<true>) {
  if (!message.inGuild()) return;
  const entry = await message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
      limit: 3,
    })
    .then((v) =>
      v.entries.find(
        (e) =>
          e.target?.equals(message.author) &&
          e.extra.channel.id === message.channel.id,
      ),
    );
  const lastLog = lastLogs.get(message.guild.id);
  if (
    entry &&
    !(lastLog?.id === entry.id && lastLog.extra.count >= entry.extra.count)
  ) {
    lastLogs.set(message.guild.id, entry);
    return entry;
  }
}
