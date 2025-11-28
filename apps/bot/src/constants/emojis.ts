import { client } from '@/index.js';

export const success = {
  circleCheck: 'success_circle_check',
} satisfies Record<string, `success_${string}`>;

export const danger = {
  circleX: 'danger_circle_x',
} satisfies Record<string, `danger_${string}`>;

type successEmojiName = (typeof success)[keyof typeof success];
type dangerEmojiName = (typeof danger)[keyof typeof danger];
type EmojiName = successEmojiName | dangerEmojiName;

export function getBotEmoji(emojiName: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === emojiName) ?? '❌';
}
