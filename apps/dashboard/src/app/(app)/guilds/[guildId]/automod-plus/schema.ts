import { autoModSetting } from '@repo/database';
import { domainRegex, snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';

export const domainListSchema = z
  .array(z.string().regex(domainRegex))
  .max(20)
  .refine(isUniqueArray, { message: '重複したドメインが含まれています。' });

export const settingFormSchema = createInsertSchema(autoModSetting, {
  domainList: domainListSchema,
  ignoreChannels: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  ignoreRoles: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  logChannel: (schema) => schema.regex(snowflakeRegex),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && v.enableLog && !v.logChannel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません。',
        path: ['logChannel'],
      });
    }
  });
