import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
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
import { resolve } from 'path';
import { db } from './drizzle';
import { per, siUnit } from './util';

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(isBetween);

GlobalFonts.registerFromPath(resolve(__dirname, '../fonts/NotoSansJP-Regular.ttf'), 'NotoSansJP');
GlobalFonts.registerFromPath(
  resolve(__dirname, '../fonts/NotoSansJP-Black.ttf'),
  'NotoSansJP-Black',
);

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

export async function createRankCard({ user, guild, roles }: GuildMember) {
  const data = await getLevelDataWithRank(guild.id, user.id);
  if (!data) throw new ReferenceError('Missing Level Data');

  // #region Constant
  const canvas = createCanvas(900, 250);
  const ctx = canvas.getContext('2d');
  const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 512 }));
  const avatarRadius = 80;
  const needXp = getNeedXP(data.level);
  const roleColor = roles.highest.color
    ? `#${roles.highest.color.toString(16).padStart(6, '0')}`
    : '#ffffff';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#1b1b1f';
  ctx.lineCap = 'round';
  ctx.lineWidth = 25;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 半透明の黒い影
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  // #endregion

  // #region Background
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  // #endregion

  // #region Avatar
  ctx.save();
  ctx.beginPath();
  ctx.arc(30 + avatarRadius, 125, avatarRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#18181b';
  ctx.fill();
  ctx.lineWidth = 15;
  ctx.strokeStyle = '#18181b';
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(avatar, 30, 125 - avatarRadius, avatarRadius * 2, avatarRadius * 2);
  ctx.restore();
  // #endregion

  // #region XPBar
  const moveToXPos = avatarRadius * 2 + 80;
  const moveToYPos = 150;
  const lineToXPos = canvas.width - 45;
  const lineToYPos = 150;

  // #region BarBackground
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(moveToXPos, moveToYPos);
  ctx.lineTo(lineToXPos, lineToYPos);
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 40;
  ctx.stroke();
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 30;
  ctx.stroke();
  ctx.restore();
  // #endregion

  // #region BarProgress
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(moveToXPos, moveToYPos);
  ctx.lineTo(
    moveToXPos + ((lineToXPos - moveToXPos) / 100) * Math.max(1, per(data.xp, needXp)),
    lineToYPos,
  );
  ctx.strokeStyle = roleColor;
  ctx.lineWidth = 30;
  ctx.stroke();
  ctx.restore();
  // #endregion
  // #endregion

  // #region Texts
  // #region UserName
  ctx.save();
  ctx.font = '36px NotoSansJP-Black';
  ctx.fillStyle = '#fff';

  if (user.displayName) {
    const displayNameMetrics = ctx.measureText(user.displayName);
    ctx.font = '28px NotoSansJP';
    const usernameMetrics = ctx.measureText(user.username);
    ctx.font = '36px NotoSansJP-Black';

    if (displayNameMetrics.width + usernameMetrics.width > 500) {
      ctx.fillText(user.displayName, 225, 71, 500);
      ctx.font = '28px NotoSansJP';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`${user.username}`, 225, 110, 500);
    } else {
      ctx.fillText(user.displayName, 225, 110, 500);
      ctx.font = '28px NotoSansJP';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`${user.username}`, 225 + (displayNameMetrics.width + 10), 110, 500);
    }
  } else {
    ctx.fillText(user.username, 225, 110, 500);
  }
  ctx.restore();
  // #endregion

  // #region Rank
  ctx.save();
  ctx.font = '48px NotoSansJP';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText(`${data.rank}`, canvas.width - 45, 90);
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText('#', canvas.width - 45 - ctx.measureText(`${data.rank}`).width, 90);
  ctx.restore();
  // #endregion

  // #region Level
  ctx.save();
  ctx.font = '28px NotoSansJP';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText('Lv.', 225, 205);
  ctx.fillStyle = '#fff';
  ctx.fillText(`${data.level}`, 225 + ctx.measureText('Lv. ').width, 205);
  ctx.restore();
  // #endregion

  // #region XP
  ctx.save();
  ctx.font = '28px NotoSansJP';
  ctx.fillStyle = '#a1a1aa';
  ctx.textAlign = 'right';
  ctx.fillText(`/ ${siUnit(needXp)} XP`, canvas.width - 45, 205);

  const needXpMetrics = ctx.measureText(`/ ${siUnit(needXp)} XP`);
  ctx.fillStyle = '#fff';
  ctx.fillText(`${siUnit(data.xp)} `, canvas.width - 45 - needXpMetrics.width, 205);
  ctx.restore();
  // #endregion
  // #endregion

  return canvas.encodeSync('jpeg');
}
