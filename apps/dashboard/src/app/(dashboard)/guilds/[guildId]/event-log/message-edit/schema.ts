import { msgEditLogSetting } from '@repo/database';
import { createInsertSchema } from 'drizzle-zod';
import { snowflakeRegex } from '@/lib/discord/constants';

export const formSchema = createInsertSchema(msgEditLogSetting, {
  channel: (schema) => schema.regex(snowflakeRegex, '無効なIDです。'),
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
