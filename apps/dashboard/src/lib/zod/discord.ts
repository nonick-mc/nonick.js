import z from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';

// Constants
export const snowflakeSchema = z.string().regex(snowflakeRegex, '無効なIDです。');

// Embeds (フォームの機能強化に合わせてバリデーション強化が必要)
export const embedSchema = z
  .object({
    title: z.string().max(256).optional(),
    description: z.string().max(4096).optional(),
    color: z.number().int().optional(),
  })
  .superRefine((v, ctx) => {
    const embedContentsLength = [v.title?.length, v.description?.length].reduce<number>(
      (sum, num) => sum + (num || 0),
      0,
    );

    if (embedContentsLength > 6000) {
      ctx.addIssue({
        code: 'custom',
        message: '埋め込みの内容が6000文字を超えています。',
        path: ['title'],
      });
    }

    if (embedContentsLength === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '埋め込みの内容が必要です。',
        path: ['title'],
      });
    }
  });

// Message
export const messageOptionSchema = z
  .object({
    content: z.string().max(2000).optional(),
    embeds: z.array(embedSchema).max(10).optional(),
    // 必要に応じて他のプロパティを追加
  })
  .superRefine((v, ctx) => {
    if (!v.content && !v.embeds?.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'メッセージの内容が設定されていません。',
        path: ['content'],
      });
    }
  });
