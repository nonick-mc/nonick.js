import { msgExpandSetting } from '@/lib/database/src/schema/setting';
import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { isUniqueArray } from '@/lib/zod/utils';
import { ChannelType } from 'discord-api-types/v10';

export const ignorePrefixes = ['!', '?', '.', '#', '$', '%', '&', '^', '<'];

export const settingFormSchema = createInsertSchema(msgExpandSetting, {
  ignoreChannels: z
    .array(z.string().regex(snowflakeRegex))
    .max(100)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  ignoreChannelTypes: z
    .array(z.preprocess((v) => Number(v), z.nativeEnum(ChannelType)))
    .refine(isUniqueArray, { message: '重複した値が含まれています。' }),
  ignorePrefixes: z
    .array(z.string())
    .max(5)
    .refine(isUniqueArray, { message: '重複した値が含まれています。' })
    .refine((v) => v.every((prefix) => ignorePrefixes.includes(prefix)), {
      message: '無効なプレフィックスが含まれています。',
    }),
}).omit({ guildId: true, createdAt: true, updatedAt: true });
