import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { channelField, scheduleField, userField } from '@modules/fields';
import { getSendableChannel } from '@modules/util';
import {
  EmbedBuilder,
  Events,
  type GuildBasedChannel,
  type Message,
  PermissionFlagsBits,
  escapeSpoiler,
  resolveColor,
} from 'discord.js';

const autoModPlus = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {
    if (
      !message.inGuild() ||
      !message.member ||
      message.author.bot ||
      message.author.system ||
      message.member.permissions.has(PermissionFlagsBits.ManageGuild)
    )
      return;
    const setting = await db.query.autoModSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, message.guildId),
    });

    if (
      !setting?.enabled ||
      setting.ignoreChannels.includes(message.channelId) ||
      message.member.roles.cache.some((role) =>
        setting.ignoreRoles.includes(role.id),
      )
    )
      return;

    const logCh =
      setting.enableLog && setting.logChannel
        ? await getSendableChannel(message.guild, setting.logChannel).catch(
            () => null,
          )
        : null;

    if (setting.enableInviteUrlFilter) {
      const invites = await message.guild.invites.fetch();
      if (
        new RegExp(
          `(https?:\\/\\/)?(.*\\.)?discord(app)?\\.(com\\/invite|gg)\\/(?!${invites.map((invite) => invite.code).join('|')})`,
        ).test(message.content)
      ) {
        deleteMessage(message, logCh, 'サーバー招待リンク');
      }
    }
    if (
      setting.enableTokenFilter &&
      (/mfa\.[a-z0-9_-]{20,}/i.test(message.content) ||
        /[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27}/i.test(
          message.content,
        ))
    ) {
      deleteMessage(message, logCh, 'Discordアカウントのトークン');
    }
    if (
      setting.enableDomainFilter &&
      setting.domainList.some((domain) => message.content.includes(domain))
    ) {
      deleteMessage(message, logCh, 'ドメイン');
    }
  },
});

function deleteMessage(
  message: Message<true>,
  channel: GuildBasedChannel | null,
  rule?: string,
) {
  message.delete().then(() => {
    if (channel?.isTextBased())
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`✋` メッセージブロック')
            .setDescription(
              [
                channelField(message.channel, { label: 'チャンネル' }),
                userField(message.author, { label: '送信者' }),
                scheduleField(message.createdAt, { label: '送信時刻' }),
              ].join('\n'),
            )
            .setColor(resolveColor('#2b2d31'))
            .setThumbnail(message.author.displayAvatarURL())
            .setFields({
              name: 'メッセージ',
              value: escapeSpoiler(message.content),
            })
            .setFooter({ text: `ルール: ${rule}` }),
        ],
      });
  });
}

module.exports = [autoModPlus];
