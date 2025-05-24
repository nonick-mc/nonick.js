import { createInsertSchema } from '@/lib/database/src/lib/drizzle';
import { verificationSetting } from '@/lib/database/src/schema/setting';
import { snowflakeRegex } from '@/lib/database/src/utils/zod/discord';
import { z } from 'zod';

export const verificationSettingFormSchema = createInsertSchema(verificationSetting, {
  role: (s) => s.regex(snowflakeRegex),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: { i18n: 'missing_role' },
        path: ['role'],
      });
    }
  });
