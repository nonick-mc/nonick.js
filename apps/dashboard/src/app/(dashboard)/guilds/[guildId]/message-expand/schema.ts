import { msgExpandSetting } from '@repo/database';
import { ChannelType } from 'discord-api-types/v10';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';
import { isUniqueArray } from '@/lib/zod/utils';

z.config(z.locales.ja());

export const ignorePrefixes = ['!', '?', '.', '#', '$', '%', '&', '^', '<'];

export const formSchema = createInsertSchema(msgExpandSetting, {
  ignoreChannels: z
    .array(z.string().regex(snowflakeRegex, '無効なIDです。'))
    .max(50, 'チャンネルは最大50個まで設定できます。')
    .refine(isUniqueArray, '重複した値が含まれています。'),
  ignoreChannelTypes: z
    .array(z.enum(ChannelType))
    .refine(isUniqueArray, '重複した値が含まれています。'),
  ignorePrefixes: z
    .array(z.string())
    .max(5, 'プレフィックスは最大5個まで設定できます。')
    .refine(isUniqueArray, '重複した値が含まれています。')
    .refine(
      (v) => v.every((prefix) => ignorePrefixes.includes(prefix)),
      '無効なプレフィックスが含まれています。',
    ),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
