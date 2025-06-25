import { levelSystemSettings } from '@repo/database';
import { messageOptions } from '@/lib/zod/discord';
import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';

const levelRewardDataSchema = z.object({
  level: z.number().int().min(0).max(100),
  role: z.string().regex(snowflakeRegex),
  removeBeforeReward: z.boolean(),
});

const levelBoostDataSchema = z.object({
  role: z.string().regex(snowflakeRegex),
  boost: z.number().min(0).max(3),
});

export const settingFormSchema = createInsertSchema(levelSystemSettings, {
  globalBoost: (schema) => schema.min(0).max(3),
  boosts: z
    .array(levelBoostDataSchema)
    .max(20)
    .refine((data) => isUniqueArray(data.map((v) => v.role)), {
      message: '重複した値が含まれています。',
    }),
  rewards: z
    .array(levelRewardDataSchema)
    .max(20)
    .refine((data) => isUniqueArray(data.map((v) => v.level)), {
      message: '重複した値が含まれています。',
    }),
  levelUpNotificationChannel: (schema) => schema.regex(snowflakeRegex),
  levelUpNotificationMessage: messageOptions,
  denyChannels: z
    .array(z.string().regex(snowflakeRegex))
    .max(50)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  allowThreadChannels: z
    .array(z.string().regex(snowflakeRegex))
    .max(50)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  logChannel: (schema) => schema.regex(snowflakeRegex),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && v.levelUpNotificationMode === 'specified' && !v.levelUpNotificationChannel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません。',
        path: ['levelUpNotificationChannel'],
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
