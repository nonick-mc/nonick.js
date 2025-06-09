import { guild } from '@database/src/schema/guild';
import type { autoChangeVerifyLevelSetting } from '@database/src/schema/setting';
import { CronBuilder } from '@modules/cron';
import { db } from '@modules/drizzle';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {
  Colors,
  type Guild as DiscordGuild,
  EmbedBuilder,
  GuildVerificationLevel,
  inlineCode,
} from 'discord.js';
import { eq } from 'drizzle-orm';
import { client } from '../index';
dayjs.extend(timezone);
dayjs.extend(utc);

const levels: Record<
  GuildVerificationLevel,
  { name: string; description: string }
> = {
  [GuildVerificationLevel.None]: {
    name: '設定無し',
    description: '無制限',
  },
  [GuildVerificationLevel.Low]: {
    name: '低',
    description: 'メール認証がされているアカウントのみ',
  },
  [GuildVerificationLevel.Medium]: {
    name: '中',
    description: 'Discordに登録してから5分以上経過したアカウントのみ',
  },
  [GuildVerificationLevel.High]: {
    name: '高',
    description:
      'このサーバーのメンバーとなってから10分以上経過したメンバーのみ',
  },
  [GuildVerificationLevel.VeryHigh]: {
    name: '最高',
    description: '電話認証がされているアカウントのみ',
  },
};

export default new CronBuilder({ minute: 0 }, () => {
  const now = dayjs().tz('Asia/Tokyo').get('hour');
  start(now);
  end(now);
});

async function start(hour: number) {
  const settings = await db.query.autoChangeVerifyLevelSetting.findMany({
    where: (setting, { and, eq }) =>
      and(eq(setting.enabled, true), eq(setting.startHour, hour)),
  });

  for (const setting of settings) {
    const apiGuild = await client.guilds
      .fetch(setting.guildId)
      .catch(() => null);
    if (!apiGuild) return;

    const dbGuild = await db.query.guild.findFirst({
      where: (setting, { eq }) => eq(setting.id, apiGuild.id),
    });

    const level = setting.level;
    if (!dbGuild || level == null) return;

    await db
      .update(guild)
      .set({ beforeVerifyLevel: apiGuild.verificationLevel })
      .where(eq(guild.id, setting.guildId));

    apiGuild
      .setVerificationLevel(level)
      .then(() => sendLog(apiGuild, setting, level, '開始'))
      .catch(console.error);
  }
}

async function end(hour: number) {
  const settings = await db.query.autoChangeVerifyLevelSetting.findMany({
    where: (setting, { and, eq }) =>
      and(eq(setting.enabled, true), eq(setting.endHour, hour)),
  });

  for (const setting of settings) {
    const apiGuild = await client.guilds
      .fetch(setting.guildId)
      .catch(() => null);
    if (!apiGuild) return;

    const dbGuild = await db.query.guild.findFirst({
      where: (setting, { eq }) => eq(setting.id, apiGuild.id),
    });

    if (dbGuild?.beforeVerifyLevel == null) return;

    apiGuild
      .setVerificationLevel(dbGuild.beforeVerifyLevel)
      .then(() =>
        sendLog(
          apiGuild,
          setting,
          dbGuild.beforeVerifyLevel as GuildVerificationLevel,
          '終了',
        ),
      )
      .catch(console.error);
  }
}

async function sendLog(
  guild: DiscordGuild,
  { enableLog, logChannel }: typeof autoChangeVerifyLevelSetting.$inferSelect,
  level: GuildVerificationLevel,
  label: string,
) {
  if (!(enableLog && logChannel)) return;

  const channel = await guild.channels.fetch(logChannel).catch(() => null);
  if (!channel?.isTextBased()) return;

  channel
    .send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${inlineCode('✅')} 認証レベル自動変更 - ${label}`)
          .setDescription(
            [
              `サーバーの認証レベルを**${levels[level].name}**に変更しました`,
              inlineCode(levels[level].description),
            ].join('\n'),
          )
          .setColor(Colors.Green),
      ],
    })
    .catch(console.error);
}
