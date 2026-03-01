import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  return {
    prisma: {
      contactSubmission: {
        create: vi.fn(),
      },
    },
    sendContactNotification: vi.fn(),
    enforceRateLimit: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({ prisma: mocks.prisma }));
vi.mock('@/lib/mailer', () => ({
  sendContactNotification: mocks.sendContactNotification,
}));
vi.mock('@/lib/rate-limit', () => ({
  enforceRateLimit: mocks.enforceRateLimit,
}));

import { POST } from './route';

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '1.2.3.4',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    mocks.enforceRateLimit.mockReturnValue(null);
  });

  it('returns 400 for invalid JSON body', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{invalid-json',
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ error: 'Invalid JSON body.' });
    expect(mocks.prisma.contactSubmission.create).not.toHaveBeenCalled();
  });

  it('returns 400 with field errors when payload validation fails', async () => {
    const response = await POST(
      makeRequest({
        name: 'A',
        phone: '123',
        email: 'bad-email',
        location: '',
        message: 'short',
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Validation failed.');
    expect(payload.fieldErrors).toBeTruthy();
    expect(mocks.prisma.contactSubmission.create).not.toHaveBeenCalled();
  });

  it('returns 201 when submission is persisted and email notification succeeds', async () => {
    const createdAt = new Date('2026-03-02T10:00:00.000Z');
    mocks.prisma.contactSubmission.create.mockResolvedValueOnce({
      id: 'contact_1',
      createdAt,
    });
    mocks.sendContactNotification.mockResolvedValueOnce(true);

    const payload = {
      name: 'John Doe',
      phone: '+966500000000',
      email: 'john@example.com',
      location: 'Dammam',
      message: 'I want to sell a used washing machine.',
    };

    const response = await POST(makeRequest(payload));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      id: 'contact_1',
      message: 'Contact form submitted successfully.',
    });
    expect(mocks.prisma.contactSubmission.create).toHaveBeenCalledWith({
      data: payload,
    });
    expect(mocks.sendContactNotification).toHaveBeenCalledWith({
      ...payload,
      submittedAt: createdAt,
    });
  });

  it('returns 429 immediately when rate limit check blocks request', async () => {
    mocks.enforceRateLimit.mockReturnValueOnce(
      new Response(JSON.stringify({ error: 'Too many requests.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      })
    );

    const response = await POST(
      makeRequest({
        name: 'John Doe',
        phone: '+966500000000',
        email: 'john@example.com',
        location: 'Dammam',
        message: 'I want to sell a used washing machine.',
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload.error).toBe('Too many requests.');
    expect(mocks.prisma.contactSubmission.create).not.toHaveBeenCalled();
  });
});
