import {
  ContainerBuilder,
  Events,
  HeadingLevel,
  heading,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  subtext,
  TextDisplayBuilder,
  ThumbnailBuilder,
  unorderedList,
} from 'discord.js';
import { execute, Signal } from 'sunar';
import { addMessageContent } from '@/src/app/shared/message-content';
import { Default, getAppEmoji } from '@/src/constants/emoji';
import { db } from '@/src/lib/db';
import { channelField, timeField, userField } from '@/src/lib/format';
import { sendEventLog } from '../send-log';

export const signal = new Signal(Events.MessageUpdate);

execute(signal, async (oldMessage, newMessage) => {
  const guild = newMessage.guild;
  if (!guild) return;
  if (newMessage.partial) return;
  if (!oldMessage.partial && oldMessage.flags.has(MessageFlags.Ephemeral)) return;

  const setting = await db.query.msgEditLogSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });

  const container = new ContainerBuilder()
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(newMessage.author.displayAvatarURL()))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            heading(`${getAppEmoji(Default.squarePen)} メッセージ編集`, HeadingLevel.Three),
          ),
          new TextDisplayBuilder().setContent(
            unorderedList([
              userField(Default.userRound, '送信者', newMessage.author),
              channelField(Default.hash, 'チャンネル', newMessage.channel),
              timeField(Default.calendarClock, '送信時刻', newMessage.createdAt),
            ]),
          ),
        ),
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext('編集前のメッセージ')));

  const oldFiles = oldMessage.partial ? [] : await addMessageContent(container, oldMessage, 'old-');

  container
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(subtext('編集後のメッセージ')));

  const newFiles = await addMessageContent(container, newMessage);

  await sendEventLog(
    guild,
    setting,
    { components: [container], files: [...oldFiles, ...newFiles] },
    newMessage.author.id,
  );
});
