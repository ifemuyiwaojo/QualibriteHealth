import { Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * Different rate limiting strategies for various parts of the application
 * 
 * These rate limiters help prevent brute force attacks and DoS attacks
 * by limiting how frequently requests can be made from a single IP address
 */

// General API rate limiter - allows reasonable usage
export const generalLimiter = new RateLimiterMemory({
  points: 300, // Number of requests
  duration: 60, // Per minute
});

// Authentication rate limiter - more strict to prevent brute force
export const authLimiter = new RateLimiterMemory({
  points: 10, // Number of login/registration attempts
  duration: 60, // Per minute
  blockDuration: 300, // Block for 5 minutes after exceeding limit
});

// Password reset rate limiter - prevent abuse
export const passwordLimiter = new RateLimiterMemory({
  points: 3, // Number of password reset attempts
  duration: 60 * 60, // Per hour
  blockDuration: 60 * 60, // Block for an hour after exceeding limit
});

/**
 * Generic rate limiting middleware
 * 
 * @param limiter The rate limiter to use
 * @returns Express middleware function
 */
export function createRateLimiterMiddleware(limiter: RateLimiterMemory) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Use IP address as the rate limiting key, with a fallback
      const key = req.ip || req.socket.remoteAddress || "unknown";
      
      // Skip rate limiting in development mode for easier testing
      if (process.env.NODE_ENV === "development" && process.env.DISABLE_RATE_LIMIT === "true") {
        return next();
      }
      
      // Try to consume a point from the rate limiter
      await limiter.consume(key);
      
      // If successful, proceed to the next middleware
      next();
    } catch (error: any) {
      // If rate limit exceeded, return 429 Too Many Requests
      console.warn(`[${new Date().toISOString()}] WARNING security: Rate limit exceeded for IP ${req.ip}`, {
        path: req.path,
        method: req.method
      });
      
      const retryAfter = error.msBeforeNext ? Math.ceil(error.msBeforeNext / 1000) : 60;
      
      // Set Retry-After header to inform client when they can retry
      res.set("Retry-After", String(retryAfter));
      res.status(429).json({
        message: "Too many requests. Please try again later.",
        retryAfter
      });
    }
  };
}

// Export pre-configured middleware for common use cases
export const limitAPI = createRateLimiterMiddleware(generalLimiter);
export const limitAuth = createRateLimiterMiddleware(authLimiter);
export const limitPasswordReset = createRateLimiterMiddleware(passwordLimiter);