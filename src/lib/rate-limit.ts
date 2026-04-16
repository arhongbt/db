import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis not configured — rate limiting disabled');
    return null;
  }

  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '60 s'),
    analytics: true,
    prefix: 'sista-resan',
  });

  return ratelimit;
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  const limiter = getRatelimit();
  if (!limiter) {
    return { success: true, remaining: 5 };
  }
  const { success, remaining } = await limiter.limit(ip);
  return { success, remaining };
}
