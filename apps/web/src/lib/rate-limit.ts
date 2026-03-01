import { NextResponse } from 'next/server';

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type StoreValue = {
  count: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as unknown as {
  __rateLimitStore?: Map<string, StoreValue>;
};

const store = globalRateLimitStore.__rateLimitStore ?? new Map<string, StoreValue>();

if (!globalRateLimitStore.__rateLimitStore) {
  globalRateLimitStore.__rateLimitStore = store;
}

function cleanupStore(now: number) {
  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

export function enforceRateLimit(
  request: Request,
  routeKey: string,
  { windowMs, maxRequests }: RateLimitOptions
) {
  const now = Date.now();
  cleanupStore(now);

  const ip = getClientIp(request);
  const key = `${routeKey}:${ip}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (existing.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

    const response = NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
    response.headers.set('Retry-After', String(retryAfterSeconds));
    response.headers.set('X-RateLimit-Limit', String(maxRequests));
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(existing.resetAt / 1000)));

    return response;
  }

  existing.count += 1;
  store.set(key, existing);

  return null;
}
