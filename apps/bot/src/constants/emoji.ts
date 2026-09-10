import { client } from '..';

type PrefixedMap<P extends string, T extends readonly string[]> = {
  readonly [K in T[number]]: `${P}_${Lowercase<K>}`;
};

export type EmojiName =
  | (typeof Success)[keyof typeof Success]
  | (typeof Destructive)[keyof typeof Destructive]
  | (typeof Default)[keyof typeof Default]
  | (typeof Warning)[keyof typeof Warning]
  | (typeof Primary)[keyof typeof Primary];

function createEmojiMap<P extends string, T extends readonly string[]>(
  prefix: P,
  keys: T,
): PrefixedMap<P, T> {
  const result = {} as any;
  for (const key of keys) {
    result[key] = `${prefix}_${key.toLowerCase()}`;
  }
  return result;
}

// #22c55e

// #10b981
export const Success = createEmojiMap('success', ['circleCheck', 'volume2'] as const);
// #ef4444
export const Destructive = createEmojiMap('destructive', [
  'shieldAlert',
  'circleAlert',
  'flag',
  'trash2',
  'clock',
  'ban',
  'logOut',
  'volumeOff',
] as const);
// #a1a1aa
export const Default = createEmojiMap('default', [
  'arrowLeft',
  'arrowRight',
  'hash',
  'userRound',
  'calendarClock',
  'squarePen',
] as const);
// #f39c0b
export const Warning = createEmojiMap('warning', ['volume2'] as const);
// #3b82f6
export const Primary = createEmojiMap('primary', [
  'userRoundPen',
  'messageSquareText',
  'clock',
  'circleOff',
] as const);

export function getAppEmoji(name: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === name) ?? '❌️';
}

export function getAppEmojiId(name: EmojiName) {
  const emoji = getAppEmoji(name);
  return typeof emoji === 'string' ? emoji : emoji.id;
}
