import { z } from '../i18n';
import { snowflakeRegex } from './constants';
import { embed } from './embed';

export const snowflake = z.string().regex(snowflakeRegex);

export const messageOptions = z.object({
  content: z.string().max(2000).optional(),
  embeds: z.array(embed).max(10).optional(),
  // 必要に応じて他のプロパティを追加
});
