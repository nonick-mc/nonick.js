import { createInsertSchema } from '@/lib/database/src/lib/drizzle';
import { reportSetting } from '@/lib/database/src/schema/setting';
import { isUniqueArray } from '@/lib/database/src/utils/zod';
import { snowflakeRegex } from '@/lib/database/src/utils/zod/discord';
import { z } from 'zod';

export const reportSettingFormSchema = createInsertSchema(reportSetting, {
  channel: (schema) => schema.regex(snowflakeRegex),
  forumCompletedTag: (schema) => schema.regex(snowflakeRegex),
  forumIgnoredTag: (schema) => schema.regex(snowflakeRegex),
  mentionRoles: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enableMention && !v.mentionRoles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: { i18n: 'missing_role' },
        path: ['mentionRoles'],
      });
    }
  });
