import { oneLine } from 'common-tags';
import { escapeInlineCode, inlineCode, time, type User } from 'discord.js';
import { defaultColor, type EmojiName, getBotEmoji } from '@/constants/emojis.js';

export function userField(label: string, value: User) {
  return oneLine`
    ${getBotEmoji(defaultColor.userRound)}
    ${label}:
    ${value.toString()}
    [${inlineCode(escapeInlineCode(value.tag))}]
  `;
}

export function idField(label: string, value: string) {
  return oneLine`
    ${getBotEmoji(defaultColor.binary)}
    ${label}:
    ${inlineCode(value)}
  `;
}

export function countField(label: string, value: number, emojiName: EmojiName) {
  return oneLine`
    ${getBotEmoji(emojiName)}
    ${label}:
    ${inlineCode(value.toString())}
  `;
}

export function scheduleField(label: string, value: Date | number, emojiName?: EmojiName) {
  const d = typeof value === 'number' ? new Date(value) : value;
  return oneLine`
    ${getBotEmoji(emojiName ?? defaultColor.calenderDays)}
    ${label}:
    ${time(d)}
  `;
}

export function customField(label: string, value: string, emojiName: EmojiName) {
  return oneLine`
    ${getBotEmoji(emojiName)}
    ${label}:
    ${value}
  `;
}
