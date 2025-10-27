import z from 'zod';
import { snowflakeRegex } from '@/lib/discord/constants';

// Constants
export const snowflakeSchema = z.string().regex(snowflakeRegex, '無効なIDです。');

// Embeds (フォームの機能強化に合わせてバリデーション強化が必要)
export const embedFooterSchema = z.object({
  text: z.string().max(2048),
  icon_url: z.url().optional(),
});

export const embedImageSchema = z.object({
  url: z.url(),
});

export const embedThumbnailSchema = z.object({
  url: z.url(),
});

export const embedAuthorSchema = z.object({
  name: z.string().max(256),
  url: z.url().optional(),
  icon_url: z.url().optional(),
});

export const embedFieldSchema = z.object({
  name: z.string().max(256),
  value: z.string().max(1024),
  inline: z.boolean().optional(),
});

export const embedSchema = z
  .object({
    title: z.string().max(256).optional(),
    description: z.string().max(4096).optional(),
    url: z.url().optional(),
    timestamp: z.iso.datetime().optional(),
    color: z.number().int().optional(),
    footer: embedFooterSchema.optional(),
    image: embedImageSchema.optional(),
    thumbnail: embedThumbnailSchema.optional(),
    author: embedAuthorSchema.optional(),
    fields: z.array(embedFieldSchema).max(25).optional(),
  })
  .superRefine((v, ctx) => {
    const embedLength = [
      v.title?.length,
      v.description?.length,
      v.fields?.reduce((sum, field) => sum + field.name.length + field.value.length, 0),
      v.footer?.text?.length,
      v.author?.name?.length,
    ].reduce<number>((sum, num) => sum + (num || 0), 0);

    if (embedLength > 6000) {
      ctx.addIssue({
        code: 'custom',
        message: '埋め込みの内容が6000文字を超えています。',
        path: ['title'],
      });
    }
    if (embedLength === 0) {
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
    if (!v.content && !v.embeds) {
      ctx.addIssue({
        code: 'custom',
        message: 'メッセージの内容が設定されていません。',
        path: ['content'],
      });
    }
  });
