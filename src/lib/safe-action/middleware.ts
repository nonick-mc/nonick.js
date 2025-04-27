import 'server-only';

import type { Session } from 'next-auth';
import { createMiddleware } from 'next-safe-action';
import pc from 'picocolors';
import { auth } from '../auth';
import { snowflake } from '../database/src/utils/zod/discord';
import { hasDashboardAccessPermission } from '../permission';
import rateLimit from '../rate-limit';
import { ActionClientError } from './client';

const limiter = rateLimit({
  interval: 10 * 1000, // 10秒
});

export const logMiddleware = createMiddleware().define(async ({ next, metadata }) => {
  const session = await auth();
  const result = await next({ ctx: { session } });

  console.log(pc.bold(pc.blueBright('Server Action')));
  console.group();
  console.log(pc.greenBright('Result:'), result);
  console.log(pc.greenBright('Metadata:'), metadata);
  console.log(pc.greenBright('User ID:'), session?.user.id);
  console.log(pc.greenBright('Time:'), new Date().toLocaleString());
  console.groupEnd();

  return result;
});

export const authMiddleware = createMiddleware<{ ctx: { session?: Session | null } }>().define(
  async ({ next, ctx }) => {
    const session = ctx.session ?? (await auth());
    if (!session) throw new ActionClientError('Unauthorized');

    try {
      await limiter.check(5, session.user.id);
      return next({ ctx });
    } catch {
      throw new ActionClientError('Too Many Requests');
    }
  },
);

export const guildPermissionMiddleware = createMiddleware<{
  ctx: { session: Session | null };
}>().define(async ({ next, ctx, clientInput }) => {
  const { guildId } = clientInput as { guildId: string };

  const parsedGuildid = snowflake.safeParse(guildId).data;
  if (!parsedGuildid) throw new ActionClientError('Invalid Guild ID');

  const hasPermission = await hasDashboardAccessPermission(guildId, ctx.session);
  if (!hasPermission) throw new ActionClientError('Missing Permission');

  return next({ ctx });
});
