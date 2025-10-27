import { leaveMessageSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';
import { messageOptionSchema } from '@/lib/zod/discord';

z.config(z.locales.ja());

export const formSchema = createInsertSchema(leaveMessageSetting, {
  channel: (schema) => schema.regex(snowflakeRegex, '無効なIDです。'),
  message: messageOptionSchema,
})
  .omit({ guildId: true, createdAt: true, updatedAt: true })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.channel) {
      ctx.addIssue({
        code: 'custom',
        message: 'チャンネルが設定されていません。',
        path: ['channel'],
      });
    }
  });
