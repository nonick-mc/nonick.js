import { autoPublicSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeSchema } from '@/lib/zod/discord';
import { isUniqueArray } from '@/lib/zod/utils';

z.config(z.locales.ja());

export const formSchema = createInsertSchema(autoPublicSetting, {
  channels: z
    .array(snowflakeSchema)
    .max(20, 'チャンネルは最大20個まで設定できます。')
    .refine(isUniqueArray, '重複した値が含まれています。'),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
