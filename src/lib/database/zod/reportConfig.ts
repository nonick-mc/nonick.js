import { z } from 'zod';
import { Snowflake } from './util';

const ReportConfig = z
  .object({
    channel: Snowflake,
    includeModerator: z.boolean(),
    progressButton: z.boolean(),
    mention: z.object({
      enabled: z.boolean(),
      roles: z.array(Snowflake),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.mention.enabled && !v.mention.roles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ロールが設定されていません',
        path: ['mention.roles'],
      });
    }
  });

export default ReportConfig;
