import { autoChangeVerifyLevelSetting } from '@repo/database';
import { GuildVerificationLevel } from 'discord-api-types/v10';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';

z.config(z.locales.ja());

export const formSchema = createInsertSchema(autoChangeVerifyLevelSetting, {
  level: z.enum(GuildVerificationLevel),
  startHour: (schema) => schema.int().min(0).max(23),
  endHour: (schema) => schema.int().min(0).max(23),
  logChannel: (schema) => schema.regex(snowflakeRegex, '無効なIDです。'),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.startHour === v.endHour) {
      ctx.addIssue({
        code: 'custom',
        message: '終了時間と同じ値にすることはできません。',
        path: ['startHour'],
      });
      ctx.addIssue({
        code: 'custom',
        message: '開始時間と同じ値にすることはできません。',
        path: ['endHour'],
      });
    }
    if (v.enabled && v.enableLog && !v.logChannel) {
      ctx.addIssue({
        code: 'custom',
        message: 'チャンネルが設定されていません。',
        path: ['logChannel'],
      });
    }
  });
