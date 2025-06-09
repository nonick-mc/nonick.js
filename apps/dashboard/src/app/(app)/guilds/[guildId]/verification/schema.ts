import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { verificationSetting } from '@repo/database';
import { z } from 'zod';

export const settingFormSchema = createInsertSchema(verificationSetting, {
  role: (s) => s.regex(snowflakeRegex),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ロールが設定されていません。',
        path: ['role'],
      });
    }
  });
