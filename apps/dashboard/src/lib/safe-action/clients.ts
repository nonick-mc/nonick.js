import 'server-only';

import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from 'next-safe-action';
import pc from 'picocolors';
import type { ZodString } from 'zod';
import { snowflakeSchema } from '../zod/discord';
import { ActionClientError } from './error';
import { authMiddleware, guildPermissionMiddleware } from './middleware';

export const guildActionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(pc.red('Server Action Error:'), e.message);
    if (e instanceof ActionClientError) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
})
  .bindArgsSchemas<[guildId: ZodString]>([snowflakeSchema])
  .use(authMiddleware)
  .use(guildPermissionMiddleware);

export const userActionClient = createSafeActionClient({
  handleServerError: (e) => {
    console.error(pc.red('Server Action Error:'), e.message);
    if (e instanceof ActionClientError) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
})
  .bindArgsSchemas<[guildId: ZodString]>([snowflakeSchema])
  .use(authMiddleware);
