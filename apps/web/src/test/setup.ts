import { afterEach } from 'vitest';

type RateLimitStoreValue = {
  count: number;
  resetAt: number;
};

afterEach(() => {
  const globalStore = globalThis as {
    __rateLimitStore?: Map<string, RateLimitStoreValue>;
  };

  globalStore.__rateLimitStore?.clear();
});
