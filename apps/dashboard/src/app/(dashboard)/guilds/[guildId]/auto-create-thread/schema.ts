import { autoCreateThreadRule } from '@repo/database';
import { ThreadAutoArchiveDuration } from 'discord-api-types/v10';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';
import { snowflakeSchema } from '@/lib/zod/discord';
import { isUniqueArray } from '@/lib/zod/utils';

z.config(z.locales.ja());

const ruleSchema = createInsertSchema(autoCreateThreadRule, {
  channelId: (schema) => schema.regex(snowflakeRegex, '無効なIDです。'),
  threadName: (schema) => schema.min(1).max(100),
  autoArchiveDuration: (schema) => schema.pipe(z.enum(ThreadAutoArchiveDuration)),
  ignoreRoles: z
    .array(snowflakeSchema)
    .max(20, 'ロールは最大20個まで設定できます。')
    .refine(isUniqueArray, '重複した値が含まれています。'),
}).omit({ guildId: true, createdAt: true, updatedAt: true });

export const createRuleFormSchema = ruleSchema.omit({ enabled: true });
export const updateRuleFormSchema = ruleSchema.omit({ channelId: true });
