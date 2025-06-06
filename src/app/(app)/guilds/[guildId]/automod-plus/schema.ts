import { autoModSetting } from '@/lib/database/src/schema/setting';
import { domainRegex, snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';

export const settingFormSchema = createInsertSchema(autoModSetting, {
  domainList: z.preprocess(
    (v) =>
      String(v)
        .split(/,|\n/)
        .reduce<string[]>((acc, item) => {
          const trimmed = item.trim();
          if (trimmed) acc.push(trimmed);
          return acc;
        }, []),
    z
      .array(z.string())
      .max(20)
      .refine((v) => v.every((domain) => domainRegex.test(domain)), {
        params: { i18n: 'invalid_domains' },
      })
      .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  ),
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
