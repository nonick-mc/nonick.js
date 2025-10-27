import { autoModSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';
import { snowflakeSchema } from '@/lib/zod/discord';
import { isUniqueArray } from '@/lib/zod/utils';

z.config(z.locales.ja());

// z
//     .array(z.string().regex(domainRegex, '無効なドメインです。'))
//     .max(20)
//     .refine(isUniqueArray, '重複したドメインが含まれています。'),

const domainRegex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

export function parseDomainList(value: unknown) {
  return String(value)
    .split(/,|\n/)
    .reduce<string[]>((acc, item) => {
      const trimmed = item.trim();
      if (trimmed) acc.push(trimmed);
      return acc;
    }, []);
}

export const formSchema = createInsertSchema(autoModSetting, {
  domainList: z.preprocess(
    parseDomainList,
    z
      .array(z.string())
      .max(20, 'ドメインは最大20個まで設定できます。')
      .refine(
        (v) => v.every((domain) => domainRegex.test(domain)),
        '無効なドメインが含まれています。',
      )
      .refine(isUniqueArray, '重複した値が含まれています。'),
  ),
  ignoreChannels: z
    .array(snowflakeSchema)
    .max(100)
    .refine(isUniqueArray, '重複した値が含まれています。'),
  ignoreRoles: z
    .array(snowflakeSchema)
    .max(100)
    .refine(isUniqueArray, '重複した値が含まれています。'),
  logChannel: (schema) => schema.regex(snowflakeRegex, '無効なIDです。'),
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && v.enableLog && !v.logChannel) {
      ctx.addIssue({
        code: 'custom',
        message: 'チャンネルが設定されていません。',
        path: ['logChannel'],
      });
    }
  });
