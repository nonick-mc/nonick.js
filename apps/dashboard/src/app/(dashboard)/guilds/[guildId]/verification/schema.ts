import { verificationSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';

z.config(z.locales.ja());

export const formSchema = createInsertSchema(verificationSetting, {
  role: (s) => s.regex(snowflakeRegex, '無効なIDです。'),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.role) {
      ctx.addIssue({
        code: 'custom',
        message: 'ロールが設定されていません。',
        path: ['role'],
      });
    }
  });
