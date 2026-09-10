import {
  Colors,
  ContainerBuilder,
  Events,
  HeadingLevel,
  heading,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  unorderedList,
} from 'discord.js';
import { execute, Signal } from 'sunar';
import {
  Default,
  Destructive,
  type EmojiName,
  getAppEmoji,
  Success,
  Warning,
} from '@/src/constants/emoji';
import { db } from '@/src/lib/db';
import { channelField, userField } from '@/src/lib/format';
import { sendEventLog } from '../send-log';

export const signal = new Signal(Events.VoiceStateUpdate);

execute(signal, async (oldState, newState) => {
  if (oldState.channelId === newState.channelId) return;

  const guild = newState.guild;
  const member = newState.member;
  if (!member) return;

  const oldChannel = oldState.channel;
  const newChannel = newState.channel;

  let title: string;
  let emoji: EmojiName;
  let color: number;
  let fields: string[];

  if (!oldChannel && newChannel) {
    title = 'ボイスチャンネル接続';
    emoji = Success.volume2;
    color = Colors.Green;
    fields = [
      userField(Default.userRound, '接続者', member.user),
      channelField(Default.hash, 'チャンネル', newChannel),
    ];
  } else if (oldChannel && !newChannel) {
    title = 'ボイスチャンネル切断';
    emoji = Destructive.volumeOff;
    color = Colors.Red;
    fields = [
      userField(Default.userRound, '切断者', member.user),
      channelField(Default.hash, 'チャンネル', oldChannel),
    ];
  } else if (oldChannel && newChannel) {
    title = 'ボイスチャンネル移動';
    emoji = Warning.volume2;
    color = Colors.Yellow;
    fields = [
      userField(Default.userRound, '移動者', member.user),
      channelField(Default.hash, '移動元チャンネル', oldChannel),
      channelField(Default.hash, '移動先チャンネル', newChannel),
    ];
  } else {
    return;
  }

  const setting = await db.query.voiceLogSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });

  const container = new ContainerBuilder()
    .setAccentColor(color)
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(member.displayAvatarURL()))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            heading(`${getAppEmoji(emoji)} ${title}`, HeadingLevel.Three),
          ),
          new TextDisplayBuilder().setContent(unorderedList(fields)),
        ),
    );

  await sendEventLog(guild, setting, { components: [container] }, member.id);
});
