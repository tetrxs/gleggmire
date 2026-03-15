import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize if credentials are available
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// General API rate limit: 30 requests per 10 seconds per IP
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "10 s"),
      prefix: "ratelimit:api",
    })
  : null;

// Submission rate limit: 5 submissions per minute per IP
export const submitRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "ratelimit:submit",
    })
  : null;

// Comment rate limit: 10 comments per minute per IP
export const commentRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "ratelimit:comment",
    })
  : null;

// Auth rate limit: 5 login attempts per minute per IP
export const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "ratelimit:auth",
    })
  : null;

/**
 * Check rate limit for a given identifier (usually IP).
 * Returns { success: true } if allowed, { success: false, reset } if blocked.
 * If Redis is not configured, always allows (development mode).
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; reset?: number }> {
  if (!limiter) {
    return { success: true };
  }

  const result = await limiter.limit(identifier);
  return { success: result.success, reset: result.reset };
}
