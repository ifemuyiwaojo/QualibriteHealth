import { Request, Response, NextFunction } from "express";

/**
 * Middleware to apply security headers to all responses
 * 
 * These headers help protect against various web security issues
 * including XSS, clickjacking, MIME sniffing, etc.
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Content Security Policy (CSP)
  // Restricts sources of content that can be loaded
  const cspDirectives = [
    // Default policy for resources without explicit directives
    "default-src 'self'",
    
    // JavaScript sources
    "script-src 'self' 'unsafe-inline'",
    
    // CSS sources
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Font sources
    "font-src 'self' https://fonts.gstatic.com",
    
    // Image sources
    "img-src 'self' data: https:",
    
    // Connect sources (for fetch, websockets, etc.)
    "connect-src 'self' https://app.getcharla.com wss://app.getcharla.com",
    
    // Frame sources (for iframes)
    "frame-src 'self'",
    
    // Media sources (audio, video)
    "media-src 'self'"
  ].join("; ");
  
  // Set various security headers
  res.setHeader("Content-Security-Policy", cspDirectives);
  
  // X-Content-Type-Options
  // Prevents MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // X-Frame-Options
  // Prevents clickjacking by forbidding the page from being displayed in an iframe
  res.setHeader("X-Frame-Options", "DENY");
  
  // X-XSS-Protection
  // Enables the browser's built-in XSS filtering
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Strict-Transport-Security
  // Forces HTTPS connections
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }
  
  // Referrer-Policy
  // Controls how much referrer information should be included with requests
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions-Policy (formerly Feature-Policy)
  // Restricts which browser features the site can use
  res.setHeader(
    "Permissions-Policy",
    "camera=self, microphone=self, geolocation=(), payment=()"
  );
  
  next();
}