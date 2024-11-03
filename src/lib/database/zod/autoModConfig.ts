import { z } from 'zod';
import { Snowflake } from './util';

const domainRegex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

const AutoModConfig = z
  .object({
    enabled: z.boolean(),
    filter: z.object({
      domain: z.object({
        enabled: z.boolean(),
        list: z.preprocess(
          (v) =>
            String(v)
              .split(/,|\n/)
              .reduce<string[]>((acc, item) => {
                const trimmed = item.trim();
                if (trimmed) acc.push(trimmed);
                return acc;
              }, []),
          z.array(z.string()).max(20, '20個以上のドメインを登録することはできません'),
        ),
      }),
      token: z.boolean(),
      inviteUrl: z.boolean(),
    }),
    ignore: z.object({
      channels: z.array(Snowflake),
      roles: z.array(Snowflake),
    }),
    log: z.object({
      enabled: z.boolean(),
      channel: Snowflake.nullable(),
    }),
  })
  .superRefine((v, ctx) => {
    if (!v.filter.domain.list.every((v) => domainRegex.test(v))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '無効なドメインが含まれています',
        path: ['filter.domain.list'],
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

export default AutoModConfig;
