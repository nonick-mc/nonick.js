import { client } from '@/index.js';

export const success = {
  circleCheck: 'success_circle_check',
} as const satisfies Record<string, `success_${string}`>;

export const danger = {
  circleX: 'danger_circle_x',
} as const satisfies Record<string, `danger_${string}`>;

type DangerEmojiValues = (typeof danger)[keyof typeof danger];
type SuccessEmojiValues = (typeof success)[keyof typeof success];
type EmojiName = DangerEmojiValues | SuccessEmojiValues;

export function getBotEmoji(name: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === name) ?? '';
}
