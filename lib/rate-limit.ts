// Rate limiting utilities for API routes
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Initialize Redis client (fallback to in-memory if not configured)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : undefined;

// Rate limiters for different endpoints
export const createRateLimiter = (
  tokens: number,
  window: string,
  prefix: string = "sankalp"
) => {
  if (!redis) {
    console.warn("Redis not configured, using basic rate limiting");
    return null; // Skip rate limiting if Redis is not available
  }

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window as any),
    prefix,
  });
};

// Different rate limiters for different use cases
export const rateLimiters = {
  // General API rate limiter
  api: createRateLimiter(100, "60 s", "sankalp:api"),
  
  // Strict rate limiter for authentication endpoints
  auth: createRateLimiter(5, "60 s", "sankalp:auth"),
  
  // Admin API rate limiter
  admin: createRateLimiter(50, "60 s", "sankalp:admin"),
  
  // File upload rate limiter
  upload: createRateLimiter(10, "60 s", "sankalp:upload"),
  
  // Public API rate limiter
  public: createRateLimiter(1000, "3600 s", "sankalp:public"),
};

// Rate limiting middleware
export const withRateLimit = (
  rateLimiter: Ratelimit | null,
  getIdentifier?: (req: NextRequest) => string
) => {
  return async (req: NextRequest) => {
    try {
      // Skip rate limiting if not configured
      if (!rateLimiter) {
        return { success: true, headers: {} };
      }

      // Get client identifier (IP address or user ID)
      const identifier = getIdentifier 
        ? getIdentifier(req)
        : getClientIP(req);

      const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);

      if (!success) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            limit,
            reset,
            remaining,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        );
      }

      return {
        success: true,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      };
    } catch (error) {
      console.error("Rate limiting error:", error);
      // Allow request if rate limiting fails
      return { success: true, headers: {} };
    }
  };
};

// Helper function to get client IP
export const getClientIP = (req: NextRequest): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
};

// Enhanced rate limiting for authenticated users
export const withAuthRateLimit = (rateLimiter: Ratelimit | null) => {
  return withRateLimit(rateLimiter, (req) => {
    // Try to get user ID from request headers (set by auth middleware)
    const userId = req.headers.get("x-user-id");
    
    if (userId) {
      return `user:${userId}`;
    }
    
    // Fallback to IP address
    return `ip:${getClientIP(req)}`;
  });
};

// Simple rate limiting check function for API routes
export const checkRateLimit = async (
  req: NextRequest,
  rateLimiter: Ratelimit | null
): Promise<{ allowed: boolean; response?: Response }> => {
  if (!rateLimiter) {
    return { allowed: true };
  }

  try {
    const identifier = getClientIP(req);
    const { success, limit, reset, remaining } = await rateLimiter.limit(identifier);

    if (!success) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            limit,
            reset,
            remaining,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          }
        ),
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Rate limiting error:", error);
    return { allowed: true };
  }
};
