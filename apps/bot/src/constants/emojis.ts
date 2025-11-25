import { client } from '@/index.js';

export const success = {
  circleCheck: 'success_circle_check',
} satisfies Record<string, `success_${string}`>;

type successEmojiName = (typeof success)[keyof typeof success];
type EmojiName = successEmojiName;

export function getBotEmoji(emojiName: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === emojiName) ?? '❌';
}
