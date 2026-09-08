import {
  inlineCode,
  type TextBasedChannel,
  TimestampStyles,
  time,
  type User,
  unorderedList,
} from 'discord.js';
import { Destructive, type EmojiName, getAppEmoji, Success } from '../constants/emoji';

export function unorderedListTable(data: { label: string; value: string }[]) {
  return unorderedList(data.map((v) => `${v.label}: ${v.value}`));
}

export function errorMessage(content: string) {
  return `${getAppEmoji(Destructive.circleAlert)} ${content}`;
}
export function successMessage(content: string) {
  return `${getAppEmoji(Success.circleCheck)} ${content}`;
}

export function baseField(emojiName: EmojiName, label: string, value: string) {
  return `${getAppEmoji(emojiName)} ${label}: ${value.split('\n').join(' ')}`;
}
export function userField(emojiName: EmojiName, label: string, user: User) {
  return baseField(emojiName, label, `${user} ${inlineCode(user.username)}`);
}
export function channelField(emojiName: EmojiName, label: string, channel: TextBasedChannel) {
  const name = 'name' in channel && channel.name ? inlineCode(channel.name) : '';
  return baseField(emojiName, label, name ? `${channel} ${name}` : `${channel}`);
}
export function reasonField(emojiName: EmojiName, label: string, value: string | null) {
  return baseField(emojiName, label, value ?? inlineCode('理由が入力されていません'));
}
export function timeField(
  emojiName: EmojiName,
  label: string,
  value: string | number | Date,
  showRelativeTime?: boolean,
) {
  const date = new Date(value);
  const longDateShortTime = time(date, TimestampStyles.LongDateShortTime);
  const content = showRelativeTime
    ? `${longDateShortTime} (${time(date, TimestampStyles.RelativeTime)})`
    : longDateShortTime;
  return baseField(emojiName, label, content);
}
