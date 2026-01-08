import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple in-memory rate limiter using sliding window algorithm.
 *
 * Note: This works per-instance in serverless environments. For production
 * at scale, consider upgrading to Upstash Rate Limit (@upstash/ratelimit)
 * which uses Redis for distributed rate limiting.
 *
 * Usage:
 *   const limiter = createRateLimiter({ limit: 10, windowMs: 60000 });
 *   const result = await limiter.check(request);
 *   if (!result.success) return result.response;
 */

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Custom key generator (defaults to IP-based) */
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  response?: NextResponse;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store with automatic cleanup
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
let cleanupInterval: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetTime < now) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Extracts client IP from request headers.
 * Handles various proxy configurations.
 */
function getClientIp(request: NextRequest): string {
  // Check common proxy headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP (original client)
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Vercel-specific header
  const vercelForwardedFor = request.headers.get('x-vercel-forwarded-for');
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(',')[0].trim();
  }

  // Fallback - in development this might be undefined
  return 'anonymous';
}

/**
 * Creates a rate limiter with the specified configuration.
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { limit, windowMs, keyGenerator } = config;

  startCleanup();

  return {
    /**
     * Check if the request is within rate limits.
     * Returns success: false with a 429 response if limit exceeded.
     */
    async check(request: NextRequest, routeKey?: string): Promise<RateLimitResult> {
      const baseKey = keyGenerator ? keyGenerator(request) : getClientIp(request);
      const key = routeKey ? `${routeKey}:${baseKey}` : baseKey;
      const now = Date.now();

      let entry = store.get(key);

      // If no entry or window expired, create new entry
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 1,
          resetTime: now + windowMs,
        };
        store.set(key, entry);

        return {
          success: true,
          remaining: limit - 1,
          reset: entry.resetTime,
        };
      }

      // Increment count
      entry.count++;

      // Check if over limit
      if (entry.count > limit) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

        return {
          success: false,
          remaining: 0,
          reset: entry.resetTime,
          response: NextResponse.json(
            {
              success: false,
              error: 'Too many requests. Please try again later.',
              retryAfter,
            },
            {
              status: 429,
              headers: {
                'Retry-After': String(retryAfter),
                'X-RateLimit-Limit': String(limit),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(entry.resetTime),
              },
            }
          ),
        };
      }

      return {
        success: true,
        remaining: limit - entry.count,
        reset: entry.resetTime,
      };
    },
  };
}

// Pre-configured limiters for different use cases

/** Standard API limiter: 60 requests per minute */
export const standardLimiter = createRateLimiter({
  limit: 60,
  windowMs: 60 * 1000,
});

/** Strict limiter for expensive operations: 10 requests per minute */
export const strictLimiter = createRateLimiter({
  limit: 10,
  windowMs: 60 * 1000,
});

/** Auth limiter for password attempts: 5 attempts per minute per resource */
export const authLimiter = createRateLimiter({
  limit: 5,
  windowMs: 60 * 1000,
});

/**
 * Helper to apply rate limiting at the start of a route handler.
 *
 * Usage:
 *   export async function POST(request: NextRequest) {
 *     const rateLimitResult = await applyRateLimit(request, strictLimiter, 'generate-telos');
 *     if (rateLimitResult) return rateLimitResult;
 *     // ... rest of handler
 *   }
 */
export async function applyRateLimit(
  request: NextRequest,
  limiter: ReturnType<typeof createRateLimiter>,
  routeKey: string
): Promise<NextResponse | null> {
  const result = await limiter.check(request, routeKey);
  if (!result.success && result.response) {
    return result.response;
  }
  return null;
}
