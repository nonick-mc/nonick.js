import { type BetterFetchPlugin, type RetryOptions, createFetch } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';

export const defaultRetryOption: RetryOptions = {
  type: 'linear',
  attempts: 2,
  delay: 1,
  shouldRetry: (res) => {
    if (!res || res.status === 429) return true;
    return false;
  },
};

export const defaultPlugins: BetterFetchPlugin[] = [
  logger({
    enabled: process.env.NODE_ENV === 'development',
  }),
];
