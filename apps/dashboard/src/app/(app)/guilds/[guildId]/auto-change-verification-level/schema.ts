import { autoChangeVerifyLevelSetting } from '@/lib/database/src/schema/setting';
import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { GuildVerificationLevel } from 'discord-api-types/v10';

export const settingFormSchema = createInsertSchema(autoChangeVerifyLevelSetting, {
  level: z.preprocess((v) => Number(v), z.nativeEnum(GuildVerificationLevel)),
  startHour: z.preprocess((v) => Number(v), z.number().int().min(0).max(23)),
  endHour: z.preprocess((v) => Number(v), z.number().int().min(0).max(23)),
  logChannel: (schema) => schema.regex(snowflakeRegex),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.startHour === v.endHour) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '開始時間と終了時間を同じ値にすることはできません。',
        path: ['endHour'],
      });
    }
    if (v.enabled && v.enableLog && !v.logChannel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません。',
        path: ['logChannel'],
      });
    }
  });
