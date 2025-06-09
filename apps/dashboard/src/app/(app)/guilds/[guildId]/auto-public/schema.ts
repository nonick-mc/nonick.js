import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';
import { autoPublicSetting } from '@repo/database';

export const settingFormSchema = createInsertSchema(autoPublicSetting, {
  channels: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
