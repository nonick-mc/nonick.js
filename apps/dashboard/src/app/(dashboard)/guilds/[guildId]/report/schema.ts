import { reportSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';
import { snowflakeSchema } from '@/lib/zod/discord';
import { isUniqueArray } from '@/lib/zod/utils';

z.config(z.locales.ja());

export const formSchema = createInsertSchema(reportSetting, {
  channel: (schema) => schema.regex(snowflakeRegex, '無効なIDです。'),
  forumCompletedTag: (schema) => schema.regex(snowflakeRegex, '無効なIDです。').nullable(),
  forumIgnoredTag: (schema) => schema.regex(snowflakeRegex, '無効なIDです。').nullable(),
  mentionRoles: z
    .array(snowflakeSchema)
    .max(10, 'ロールは最大10個まで設定できます。')
    .refine(isUniqueArray, '重複した値が含まれています。'),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
