import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: vi.fn(() => ({})) },
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow = vi.fn(() => ({}));
    limit = vi.fn(async () => ({ success: true, remaining: 4, limit: 5, reset: Date.now() + 60000 }));
    constructor() {}
  },
}));

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  });

  it('allows requests within limit', async () => {
    const { checkRateLimit } = await import('../rate-limit');
    const result = await checkRateLimit('127.0.0.1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows all when Redis not configured', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    const { checkRateLimit } = await import('../rate-limit');
    const result = await checkRateLimit('127.0.0.1');
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(5);
  });
});
