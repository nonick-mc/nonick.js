import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { channelField, scheduleField, userField } from '@modules/fields';
import { createAttachment, getSendableChannel } from '@modules/util';
import { Colors, EmbedBuilder, Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.MessageUpdate,
  async execute(oldMessage, { content, attachments }) {
    if (!oldMessage.inGuild()) return;
    const setting = await db.query.msgEditLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, oldMessage.guild.id),
    });
    if (!(setting?.enabled && setting.channel)) return;
    const channel = await getSendableChannel(
      oldMessage.guild,
      setting.channel,
    ).catch(() => null);
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setTitle('`💬` メッセージ編集')
      .setURL(oldMessage.url)
      .setDescription(
        [
          channelField(oldMessage.channel),
          userField(oldMessage.author, { label: '送信者' }),
          scheduleField(oldMessage.createdAt, { label: '送信時刻' }),
        ].join('\n'),
      )
      .setColor(Colors.Yellow)
      .setThumbnail(oldMessage.author.displayAvatarURL())
      .setTimestamp();
    const contentChanged = oldMessage.content !== content;
    if (contentChanged) {
      embed.addFields(
        { name: '変更前', value: oldMessage.content ?? 'なし' },
        { name: '変更後', value: content ?? 'なし' },
      );
    }

    const attachment = await createAttachment(
      oldMessage.attachments.difference(attachments),
    );
    if (attachment) channel.send({ embeds: [embed], files: [attachment] });
    if (contentChanged) channel.send({ embeds: [embed] });
  },
});
