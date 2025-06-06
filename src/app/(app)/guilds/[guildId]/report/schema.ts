import { reportSetting } from '@/lib/database/src/schema/setting';
import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';

export const settingFormSchema = createInsertSchema(reportSetting, {
  channel: (schema) => schema.regex(snowflakeRegex),
  forumCompletedTag: (schema) => schema.regex(snowflakeRegex),
  forumIgnoredTag: (schema) => schema.regex(snowflakeRegex),
  mentionRoles: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enableMention && !v.mentionRoles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ロールが設定されていません。',
        path: ['mentionRoles'],
      });
    }
  });
