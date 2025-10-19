import { autoCreateThreadSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeSchema } from '@/lib/zod/discord';
import { isUniqueArray } from '@/lib/zod/utils';

export const formSchema = createInsertSchema(autoCreateThreadSetting, {
  channels: z
    .array(snowflakeSchema)
    .max(20, 'チャンネルは最大20個まで設定できます。')
    .refine(isUniqueArray, '重複した値が含まれています。'),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
