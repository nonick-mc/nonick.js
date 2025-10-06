import type { RetryOptions } from '@better-fetch/fetch';

export const defaultRetryOption: RetryOptions = {
  type: 'linear',
  attempts: 3,
  delay: 1000,
  shouldRetry: (res) => {
    if (!res || res.status === 429) return true;
    return false;
  },
};
