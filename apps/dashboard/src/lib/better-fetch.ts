import type { RetryOptions } from '@better-fetch/fetch';

export const defaultRetryOption: RetryOptions = {
  type: 'linear',
  attempts: 2,
  delay: 1,
  shouldRetry: (res) => {
    if (!res || res.status === 429) return true;
    return false;
  },
};
