import { client } from '..';

type PrefixedMap<T extends Record<string, string>, P extends string> = {
  readonly [K in keyof T]: `${P}_${T[K]}`;
};

type EmojiName = (typeof Success)[keyof typeof Success];

function createEmojiMap<T extends Record<string, string>, P extends string>(
  prefix: P,
  input: T,
): PrefixedMap<T, P> {
  const result = {} as any;
  for (const key in input) {
    result[key] = `${prefix}_${input[key]}`;
  }
  return result;
}

// #22c55e
export const Success = createEmojiMap('success', {
  circleCheck: 'circlecheck',
} as const);

export function getAppEmoji(name: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === name) ?? '❌️';
}
