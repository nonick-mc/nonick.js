import { reportSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeSchema } from '@/lib/zod/discord';
import { isUniqueArray } from '@/lib/zod/utils';

z.config(z.locales.ja());

export const formSchema = createInsertSchema(reportSetting, {
  channel: snowflakeSchema,
  forumCompletedTag: snowflakeSchema.nullable(),
  forumIgnoredTag: snowflakeSchema.nullable(),
  mentionRoles: z
    .array(snowflakeSchema)
    .max(100)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
