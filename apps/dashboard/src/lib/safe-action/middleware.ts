import 'server-only';

import { createMiddleware } from 'next-safe-action';
import { canAccessDashboard, getCachedSession } from '../dal';
import rateLimit from '../rate-limit';
import { snowflakeSchema } from '../zod/discord';
import { ActionClientError } from './error';

const limiter = rateLimit({
  interval: 10 * 1000, // 10秒
});

export const authMiddleware = createMiddleware().define(async ({ next }) => {
  const session = await getCachedSession();
  if (!session) throw new ActionClientError('Unauthorized');

  try {
    await limiter.check(5, session.user.id);
    return next({ ctx: { session } });
  } catch {
    throw new ActionClientError('Too Many Requests');
  }
});

export const guildPermissionMiddleware = createMiddleware().define(
  async ({ next, ctx, bindArgsClientInputs }) => {
    const [guildId] = bindArgsClientInputs;
    if (!snowflakeSchema.safeParse(guildId).success)
      throw new ActionClientError('Invalid Guild ID');

    const hasPermission = await canAccessDashboard(guildId as string);
    if (!hasPermission) throw new ActionClientError('Missing Permission');

    return next({ ctx });
  },
);
