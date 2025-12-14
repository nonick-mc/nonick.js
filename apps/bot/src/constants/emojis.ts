import type { UserFlagsString } from 'discord.js';
import { client } from '@/index.js';

// #3b82f6
export const primary = {
  info: 'primary_info',
} satisfies Record<string, `primary_${string}`>;

// #22c55e
export const success = {
  circleCheck: 'success_circle_check',
} satisfies Record<string, `success_${string}`>;

// #eab308
export const warning = {
  circleAlert: 'warning_circle_alert',
} satisfies Record<string, `warning_${string}`>;

// #ef4444
export const danger = {
  circleX: 'danger_circle_x',
  circleAlert: 'danger_circle_alert',
} satisfies Record<string, `danger_${string}`>;

// #a1a1aa
export const defaultColor = {
  qrCode: 'qr_code',
  userRound: 'user_round',
  usersRound: 'users_round',
  binary: 'binary',
  hash: 'hash',
  calenderDays: 'calendar_days',
  idCard: 'id_card',
  award: 'award',
  shieldUser: 'shield_user',
} as const;

export const other = {
  boost: 'boost',
  nitro: 'nitro',
} as const;

export const userFlag = {
  Staff: 'flag_staff',
  Partner: 'flag_partner',
  CertifiedModerator: 'flag_certifield_moderator',
  Hypesquad: 'flag_hypesquad',
  HypeSquadOnlineHouse1: 'flag_hypesquad_online_house_1',
  HypeSquadOnlineHouse2: 'flag_hypesquad_online_house_2',
  HypeSquadOnlineHouse3: 'flag_hypesquad_online_house_3',
  BugHunterLevel1: 'flag_bug_hunter_level_1',
  BugHunterLevel2: 'flag_bug_hunter_level_2',
  ActiveDeveloper: 'flag_active_developer',
  VerifiedDeveloper: 'flag_verified_developer',
  PremiumEarlySupporter: 'flag_premium_early_supporter',
} satisfies Partial<Record<UserFlagsString, `flag_${string}`>>;

type ValueOf<T> = T[keyof T];

export type EmojiName =
  | ValueOf<typeof primary>
  | ValueOf<typeof success>
  | ValueOf<typeof warning>
  | ValueOf<typeof danger>
  | ValueOf<typeof defaultColor>
  | ValueOf<typeof other>
  | ValueOf<typeof userFlag>;

export function getBotEmoji(emojiName: EmojiName) {
  return client.application?.emojis.cache.find((emoji) => emoji.name === emojiName) ?? '❌';
}
