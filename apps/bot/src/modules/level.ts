import type {
  LevelBoostData,
  LevelDateBoost,
  LevelRewardData,
  levelSystemSettings,
} from '@repo/database';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import type { GuildMember, Message } from 'discord.js';
import { db } from './drizzle';

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isBetween);

export function getExp(boost: number) {
  return Math.floor((Math.random() * 7 + 13) * boost);
}

export function getNeedXP(level: number) {
  return 5 * level ** 2 + 50 * level + 100;
}

export function getLevelXP(level: number, xp = 0) {
  if (level < 0) return xp;
  let currentLevel = level;
  let totalXP = xp;
  do {
    currentLevel--;
    totalXP += getNeedXP(currentLevel - 1);
  } while (currentLevel > 0);
  return totalXP;
}

export function getRewardLevel(
  level: number,
  data: LevelRewardData[],
): { before: LevelRewardData | null; current: LevelRewardData | null } {
  const current = data.findLast(({ level: n }) => n <= level);
  if (!current) return { before: null, current: null };
  const before = data[data.indexOf(current) - 1] ?? null;
  return { before, current };
}

export function validate(message: Message, setting: typeof levelSystemSettings.$inferSelect) {
  if (!(message.inGuild() && message.guild.id === setting.guildId)) return false;
  if (!message.member) return false;
  if (message.author.bot || message.author.system) return false;
  if (
    setting.denyChannels.includes(message.channelId) ||
    (message.channel.parentId && setting.denyChannels.includes(message.channel.parentId))
  )
    return false;
  if (
    (message.channel.isThread() || message.channel.isVoiceBased()) &&
    !(
      setting.allowThreadChannels.includes(message.channelId) ||
      (message.channel.parentId && setting.allowThreadChannels.includes(message.channel.parentId))
    )
  )
    return false;
  const escapeContent = message.content
    .replaceAll(/<?https?:\/\/[\w/:%#$&?()~.=+-]+>?/g, '') // URL
    .replaceAll(/<(#|@(!?|&))\d{16,}>/g, '') // メンションを
    .replaceAll(/<a?:\w{2,32}:\d{16,}>/g, '') // 絵文字
    .replaceAll(/```[^`].*?```/gs, '') // コードブロック
    .replaceAll(/`[^`].*?`/g, '') // インラインコードブロック
    .replaceAll(/\[.+\]\(.+\)/g, '') // リンク
    .replaceAll(/\s+/g, ''); // 空白
  const normalizeContent = escapeContent.replaceAll(/[^a-zぁ-んァ-ヶ\p{sc=Han}]/giu, '');
  if (escapeContent.length - normalizeContent.length > 6) return false;
  if (new Set(normalizeContent.split('')).size < 2) return false;
  return true;
}

export function getBoost(
  member: GuildMember,
  boosts: (typeof levelSystemSettings.$inferSelect)['boosts'],
) {
  const roles = member.roles.cache;
  const check = (data: LevelBoostData) =>
    (data.type === 'date' && between(data)) || (data.type === 'role' && roles.has(data.role));
  for (const data of boosts.filter((v) => v.only)) {
    if (check(data)) return data.boost;
  }
  const result: Record<string, number> = { role: 1, date: 0 };
  for (const data of boosts.filter((v) => !v.only)) {
    const type = data.type;
    if ((result[type] ?? 0) < data.boost && check(data)) result[type] = data.boost;
  }
  return Object.values(result).reduce((p, c) => p + c);
}

function between(data: LevelDateBoost) {
  const start = dayjs.tz(data.start, 'M/D', 'Asia/Tokyo');
  const _end = dayjs.tz(data.end, 'M/D', 'Asia/Tokyo');
  const end = _end.isBefore(start) ? _end.add(1, 'year') : _end;
  return dayjs().tz('Asia/Tokyo').isBetween(start, end, 'D', '[]');
}

export function merge({ level, xp }: { level: number; xp: number }, add: number) {
  let need = getNeedXP(level);
  xp += add;
  while (xp >= need) {
    level++;
    xp -= need;
    need = getNeedXP(level);
  }
  return { level, xp };
}

export async function getLevelDataWithRank(guildId: string, userId: string) {
  const all = await db.query.levels.findMany({
    where: (levels, { eq }) => eq(levels.guildId, guildId),
    orderBy: (levels, { desc }) => [desc(levels.level), desc(levels.xp)],
  });
  const levelData = all.find((data) => data.userId === userId);
  if (!levelData) return;
  const rank = all.findIndex((data) => data.userId === userId) + 1;
  return { ...levelData, rank };
}
