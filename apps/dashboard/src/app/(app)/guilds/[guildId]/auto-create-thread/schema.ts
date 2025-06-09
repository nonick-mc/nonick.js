import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';
import { autoCreateThreadSetting } from '@repo/database';

export const settingFormSchema = createInsertSchema(autoCreateThreadSetting, {
  channels: z
    .array(z.string().regex(snowflakeRegex))
    .max(20)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
