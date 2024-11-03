import { ChannelType } from 'discord-api-types/v10';
import { z } from 'zod';
import { Snowflake, findDuplicates } from './util';

export const MessageExpandIgnorePrefixes = ['!', '?', '.', '#', '$', '%', '&', '^', '<'];

const MessageExpandConfig = z
  .object({
    enabled: z.boolean(),
    allowExternalGuild: z.boolean(),
    ignore: z.object({
      channels: z.array(Snowflake),
      types: z.array(z.preprocess((v) => Number(v), z.nativeEnum(ChannelType))),
      prefixes: z.array(z.string()).max(5, '5個以上のプレフィックスを登録することはできません'),
    }),
  })
  .superRefine((value, ctx) => {
    const invalidPrefixes = value.ignore.prefixes.filter(
      (v) => !MessageExpandIgnorePrefixes.includes(v),
    );

    if (invalidPrefixes.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '無効なプレフィックスが含まれています',
        path: ['ignore.prefixes'],
      });
    }

    // if (value.ignore.prefixes.some((v) => v.length !== 1)) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: 'プレフィックスは1文字である必要があります',
    //     path: ['ignore.prefixes'],
    //   });
    // }

    if (findDuplicates(value.ignore.prefixes).length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '重複している項目があります',
        path: ['ignore.prefixes'],
      });
    }
  });

export default MessageExpandConfig;
