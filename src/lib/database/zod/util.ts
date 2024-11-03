import { z } from 'zod';

export const Snowflake = z
  .string({ required_error: '必須です' })
  .regex(/^\d{17,19}$/, '無効なIDです');

export namespace Embed {
  export const Thumbnail = z.object({
    url: z.string().url(),
    proxy_url: z.string().url().optional(),
    height: z.number().int().optional(),
    width: z.number().int().optional(),
  });

  export const Image = z.object({
    url: z.string().url(),
    proxy_url: z.string().url().optional(),
    height: z.number().int().optional(),
    width: z.number().int().optional(),
  });

  export const Author = z.object({
    name: z.string().max(256, '256文字以下である必要があります。'),
    url: z.string().url().optional(),
    icon_url: z.string().url().optional(),
    proxy_icon_url: z.string().url().optional(),
  });

  export const Footer = z.object({
    text: z.string().max(2048, '2048文字以下である必要があります。'),
    icon_url: z.string().url().optional(),
    proxy_icon_url: z.string().url().optional(),
  });

  export const Field = z.object({
    name: z.string().max(256, '256文字以下である必要があります。'),
    value: z.string().max(1024, '1024文字以下である必要があります。'),
    inline: z.boolean().optional(),
  });

  export const Structure = z
    .object({
      title: z.string().max(256, '256文字以下である必要があります。').optional(),
      description: z.string().max(4096, '4096文字以下である必要があります。').optional(),
      url: z.string().url().optional(),
      timestamp: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, '無効な日付です。')
        .optional(),
      color: z.number().int().optional(),
      footer: Footer.partial(),
      image: Image.partial(),
      thumbnail: Thumbnail.partial(),
      author: Author.partial(),
      fields: z.array(Field).max(25, 'フィールドは25個以下である必要があります。').optional(),
    })
    .superRefine((v, ctx) => {
      if (
        [
          v.title?.length,
          v.description?.length,
          v.fields?.reduce((sum, str) => sum + str.name.length + str.value.length, 0),
          v.author?.name?.length,
        ].reduce<number>((sum, num) => sum + (num || 0), 0) > 6000
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '埋め込みの文字数が合計で6000文字を超えています。',
          path: ['title'],
        });
      }

      if (Object.values(v).every((value) => !value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'タイトルか説明のいずれかを入力する必要があります。',
          path: ['title'],
        });
      }
    });
}

export const MessageOptions = z.object({
  content: z.string().max(2000, '2000文字以下である必要があります。').optional(),
  embeds: z.array(Embed.Structure).max(10, '埋め込みは10個以下である必要があります。').optional(),
  // 必要に応じて他のプロパティを追加
});

export const BaseConfigSchema = z.object({
  guildId: Snowflake,
});

export function findDuplicates(arr: string[]): string[] {
  const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);
  return duplicates;
}
