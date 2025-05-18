import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

/**
 * CSRF protection middleware for Qualibrite Health
 * 
 * This middleware implements the Double Submit Cookie pattern:
 * 1. A secure, HttpOnly cookie contains the CSRF token
 * 2. The same token must be included in request headers for state-changing operations
 * 3. The tokens are compared to verify the request origin is legitimate
 */

// Safe methods that don't modify state and don't need CSRF protection
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

/**
 * Generate a secure random CSRF token
 */
function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Set a CSRF token in cookie and expose in response header
 */
export function setCsrfToken(req: Request, res: Response): void {
  const csrfToken = generateCsrfToken();
  
  // Set the token as a secure cookie (HttpOnly prevents JS access)
  // The Secure flag ensures it only works over HTTPS
  res.cookie("XSRF-TOKEN-COOKIE", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  // Also expose the token in a header so frontend can use it
  res.setHeader("X-CSRF-TOKEN", csrfToken);
}

/**
 * CSRF protection middleware
 * 
 * This should be used on all routes that modify state (POST, PUT, DELETE, etc.)
 * It verifies that the token in the request header matches the token in the cookie.
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF check for safe methods
  if (SAFE_METHODS.includes(req.method)) {
    return next();
  }
  
  // Get the CSRF token from cookie
  const csrfCookie = req.cookies["XSRF-TOKEN-COOKIE"];
  
  // If no CSRF cookie exists yet, create one and continue
  // This typically happens on first visit
  if (!csrfCookie) {
    setCsrfToken(req, res);
    return next();
  }
  
  // Get the CSRF token from request header
  const csrfHeader = req.headers["x-csrf-token"] as string;
  
  // Verify the CSRF token matches between cookie and header
  if (!csrfHeader || csrfHeader !== csrfCookie) {
    console.warn(`[${new Date().toISOString()}] WARNING security: CSRF validation failed`, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      hasHeader: !!csrfHeader,
      headerLength: csrfHeader?.length,
      cookieLength: csrfCookie?.length
    });
    
    res.status(403).json({
      message: "CSRF validation failed. Please refresh the page and try again."
    });
    return;
  }
  
  // If validation passes, generate a new token for next request
  // This helps prevent reuse of tokens
  setCsrfToken(req, res);
  
  next();
}