import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { channelField, userField } from '@modules/fields';
import { getSendableChannel } from '@modules/util';
import { Colors, EmbedBuilder, Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    if (!newState.member) return;

    const setting = await db.query.voiceLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, oldState.guild.id),
    });
    if (!setting?.enabled || !setting?.channel) return;

    const channel = await getSendableChannel(
      oldState.guild,
      setting.channel,
    ).catch(() => null);
    if (!channel) return;

    if (
      oldState.channel &&
      newState.channel &&
      !oldState.channel.equals(newState.channel)
    )
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル移動')
            .setDescription(
              [
                userField(newState.member.user, { label: 'メンバー' }),
                channelField(oldState.channel, { label: 'チャンネル移動元' }),
                channelField(newState.channel, { label: 'チャンネル移動先' }),
              ].join('\n'),
            )
            .setColor(Colors.Yellow)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    else if (!oldState.channel && newState.channel)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル参加')
            .setDescription(
              [
                userField(newState.member.user, { label: 'メンバー' }),
                channelField(newState.channel, { label: 'チャンネル' }),
              ].join('\n'),
            )
            .setColor(Colors.Green)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    else if (oldState.channel && !newState.channel)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル退出')
            .setDescription(
              [
                userField(newState.member.user, { label: 'メンバー' }),
                channelField(oldState.channel, { label: 'チャンネル' }),
              ].join('\n'),
            )
            .setColor(Colors.Red)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
  },
});
