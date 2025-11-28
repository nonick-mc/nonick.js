import { client } from '@/index.js';

export const success = {
  circleCheck: 'success_circle_check',
} satisfies Record<string, `success_${string}`>;

export const warning = {
  circleAlert: 'warning_circle_alert',
} satisfies Record<string, `warning_${string}`>;

export const danger = {
  circleX: 'danger_circle_x',
} satisfies Record<string, `danger_${string}`>;

type successEmojiName = (typeof success)[keyof typeof success];
type warningEmojiName = (typeof warning)[keyof typeof warning];
type dangerEmojiName = (typeof danger)[keyof typeof danger];
type EmojiName = successEmojiName | warningEmojiName | dangerEmojiName;

export function getBotEmoji(emojiName: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === emojiName) ?? '❌';
}
