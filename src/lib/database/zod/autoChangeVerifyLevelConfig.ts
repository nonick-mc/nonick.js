import { GuildVerificationLevel } from 'discord-api-types/v10';
import { z } from 'zod';
import { Snowflake } from './util';

const hourError = { message: '0～23の間で設定する必要があります' };

const AutoChangeVerifyLevelConfig = z
  .object({
    enabled: z.boolean(),
    level: z.coerce.number().pipe(z.nativeEnum(GuildVerificationLevel)),
    startHour: z.coerce.number().int().min(0, hourError).max(23, hourError),
    endHour: z.coerce.number().int().min(0, hourError).max(23, hourError),
    log: z.object({
      enabled: z.boolean(),
      channel: Snowflake.nullable(),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.startHour === v.endHour) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '開始時間と終了時間を同じ値にすることはできません',
        path: ['endHour'],
      });
    }
    if (v.enabled && v.log.enabled && !v.log.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['log.channel'],
      });
    }
  });

export default AutoChangeVerifyLevelConfig;
