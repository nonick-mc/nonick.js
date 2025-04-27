import 'server-only';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { db } from '@/lib/drizzle';
import type { Session } from 'next-auth';
import type { ZodSchema, z } from 'zod';
import type { GuildDatabaseAdapter } from './utils';

/**
 * サーバーの設定を更新する
 * @param req {@link https://developer.mozilla.org/ja/docs/Web/API/Request}
 * @param params {@link https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes}
 * @param options {@link GuildDatabaseAdapter}
 */
export async function updateGuildSetting<FormSchema extends ZodSchema, DbSchema extends ZodSchema>(
  guildId: string,
  input: z.infer<FormSchema>,
  ctx: { session: Session | null },
  options: GuildDatabaseAdapter<FormSchema, DbSchema>,
) {
  if (!ctx.session) throw new Error('Unauthorized');

  const oldValue = await options.fetchOldValue(guildId);
  const newValue = await options.upsertNewValue(guildId, input);

  await db.insert(auditLog).values({
    guildId: guildId,
    authorId: ctx.session.user.id,
    targetName: options.metadata.targetName,
    actionType: 'update_guild_setting',
    oldValue,
    newValue,
  });
}
