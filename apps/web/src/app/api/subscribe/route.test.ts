import { Prisma } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    prisma: {
      subscriber: {
        create: vi.fn(),
      },
    },
    enforceRateLimit: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({ prisma: mocks.prisma }));
vi.mock('@/lib/rate-limit', () => ({
  enforceRateLimit: mocks.enforceRateLimit,
}));

import { POST } from './route';

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '5.6.7.8',
    },
    body: JSON.stringify(body),
  });
}

function makeUniqueConstraintError() {
  const error = Object.create(Prisma.PrismaClientKnownRequestError.prototype);
  Object.defineProperty(error, 'code', {
    value: 'P2002',
    enumerable: true,
    configurable: true,
  });
  return error;
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    mocks.enforceRateLimit.mockReturnValue(null);
  });

  it('returns 400 when payload is invalid', async () => {
    const response = await POST(makeRequest({ email: 'invalid-email' }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Validation failed.');
    expect(payload.fieldErrors).toBeTruthy();
    expect(mocks.prisma.subscriber.create).not.toHaveBeenCalled();
  });

  it('returns 201 and normalizes email to lowercase', async () => {
    mocks.prisma.subscriber.create.mockResolvedValueOnce({
      id: 'sub_1',
      email: 'test@example.com',
    });

    const response = await POST(makeRequest({ email: 'TEST@Example.COM' }));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({
      id: 'sub_1',
      message: 'Subscription successful.',
    });
    expect(mocks.prisma.subscriber.create).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    });
  });

  it('returns 409 when email is already subscribed', async () => {
    mocks.prisma.subscriber.create.mockRejectedValueOnce(makeUniqueConstraintError());

    const response = await POST(makeRequest({ email: 'exists@example.com' }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({ error: 'Email is already subscribed.' });
  });

  it('returns 429 immediately when rate limit blocks request', async () => {
    mocks.enforceRateLimit.mockReturnValueOnce(
      new Response(JSON.stringify({ error: 'Too many requests.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      })
    );

    const response = await POST(makeRequest({ email: 'test@example.com' }));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.error).toBe('Too many requests.');
    expect(mocks.prisma.subscriber.create).not.toHaveBeenCalled();
  });
});
