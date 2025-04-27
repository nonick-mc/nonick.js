import { validateObject } from '..';
import { z } from '../../../lib/i18n';

export const embedFooter = z.object({
  text: z.string().max(2048),
  icon_url: z.string().url().optional(),
  proxy_icon_url: z.string().url().optional(),
});

export const embedThumbnail = z.object({
  url: z.string().url(),
  proxy_url: z.string().url().optional(),
  height: z.number().int().optional(),
  width: z.number().int().optional(),
});

export const embedImage = z.object({
  url: z.string().url(),
  proxy_url: z.string().url().optional(),
  height: z.number().int().optional(),
  width: z.number().int().optional(),
});

export const embedAuthor = z.object({
  name: z.string().max(256),
  url: z.string().url().optional(),
  icon_url: z.string().url().optional(),
  proxy_icon_url: z.string().url().optional(),
});

export const embedField = z.object({
  name: z.string().max(256),
  value: z.string().max(1024),
  inline: z.boolean().optional(),
});

export const embed = z
  .object({
    title: z.string().max(256).optional(),
    description: z.string().max(4096).optional(),
    url: z.string().url().optional(),
    timestamp: z.string().datetime().optional(),
    color: z.number().int().optional(),
    footer: z.preprocess((v) => validateObject(v), embedFooter.optional()),
    image: z.preprocess((v) => validateObject(v), embedImage.optional()),
    thumbnail: z.preprocess((v) => validateObject(v), embedThumbnail.optional()),
    author: z.preprocess((v) => validateObject(v), embedAuthor.optional()),
    fields: z.array(embedField).max(25).optional(),
  })
  .superRefine((v, ctx) => {
    const embedContentLength = [
      v.title?.length,
      v.description?.length,
      v.fields?.reduce((sum, str) => sum + str.name.length + str.value.length, 0),
      v.author?.name?.length,
    ].reduce<number>((sum, num) => sum + (num || 0), 0);

    if (embedContentLength > 6000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: { i18n: 'embed_content_exceeded' },
        path: ['title'],
      });
    }

    if (embedContentLength === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: { i18n: 'embed_content_required' },
        path: ['title'],
      });
    }
  });
