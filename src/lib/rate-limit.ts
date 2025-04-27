import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number; // キャッシュ内の最大トークン数
  interval?: number; // レート制限の時間間隔（ミリ秒単位）
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage > limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}
