﻿import { messageOptions } from '@/lib/zod/discord';
import { snowflakeRegex } from '@/lib/zod/discord/constants';
import { createInsertSchema } from '@/lib/zod/drizzle';
import { z } from '@/lib/zod/i18n';
import { leaveMessageSetting } from '@repo/database';

export const settingFormSchema = createInsertSchema(leaveMessageSetting, {
  channel: (schema) => schema.regex(snowflakeRegex),
  message: messageOptions,
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません。',
        path: ['channel'],
      });
    }
  });
