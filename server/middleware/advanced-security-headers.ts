/**
 * Advanced Security Headers Middleware
 * 
 * Part of Phase 4 security improvements for Qualibrite Health.
 * This middleware adds advanced HTTP security headers that help protect
 * against common web vulnerabilities like XSS, clickjacking, etc.
 */

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../lib/logger';

export interface SecurityHeadersOptions {
  /**
   * Enable Content Security Policy (CSP)
   * Default: true
   */
  enableCSP?: boolean;
  
  /**
   * CSP Report Only mode - violations are reported but not enforced
   * Default: false in production, true in development
   */
  cspReportOnly?: boolean;
  
  /**
   * Enable Strict Transport Security (HSTS)
   * Default: true in production, false in development
   */
  enableHSTS?: boolean;
  
  /**
   * HSTS max age in seconds
   * Default: 1 year (31536000 seconds)
   */
  hstsMaxAge?: number;
  
  /**
   * Include subdomains in HSTS
   * Default: true
   */
  hstsIncludeSubDomains?: boolean;
  
  /**
   * Enable preload for HSTS
   * Default: false
   */
  hstsPreload?: boolean;
}

const DEFAULT_OPTIONS: SecurityHeadersOptions = {
  enableCSP: true,
  cspReportOnly: process.env.NODE_ENV !== 'production',
  enableHSTS: process.env.NODE_ENV === 'production',
  hstsMaxAge: 31536000, // 1 year
  hstsIncludeSubDomains: true,
  hstsPreload: false
};

/**
 * Apply advanced security headers to protect against common web vulnerabilities
 * 
 * @param options Configuration options for security headers
 * @returns Express middleware
 */
export function advancedSecurityHeaders(options: SecurityHeadersOptions = {}) {
  // Merge default options with provided options
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  console.log('Setting up advanced security headers', {
    enableCSP: config.enableCSP,
    cspReportOnly: config.cspReportOnly,
    enableHSTS: config.enableHSTS
  });
  
  return function (req: Request, res: Response, next: NextFunction) {
    // X-Content-Type-Options: Prevents MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // X-Frame-Options: Protects against clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // X-XSS-Protection: Enables browser's XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Referrer-Policy: Controls what information is included in referrer header
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions-Policy (formerly Feature-Policy): Limits which browser features the site can use
    res.setHeader(
      'Permissions-Policy',
      'geolocation=self, microphone=self, camera=self'
    );
    
    // Strict-Transport-Security (HSTS): Enforces secure connections to the server
    if (config.enableHSTS) {
      let hstsValue = `max-age=${config.hstsMaxAge}`;
      
      if (config.hstsIncludeSubDomains) {
        hstsValue += '; includeSubDomains';
      }
      
      if (config.hstsPreload) {
        hstsValue += '; preload';
      }
      
      res.setHeader('Strict-Transport-Security', hstsValue);
    }
    
    // Content-Security-Policy: Prevents XSS by specifying allowed content sources
    if (config.enableCSP) {
      const cspDirectives = [
        // Default fallback directive
        "default-src 'self'",
        
        // Script sources - 'self' for our code, allow specific CDNs if needed
        "script-src 'self' 'unsafe-inline'",
        
        // Style sources
        "style-src 'self' 'unsafe-inline'",
        
        // Image sources - allow data: for inline images
        "img-src 'self' data: blob:",
        
        // Font sources
        "font-src 'self'",
        
        // Form actions - restrict to same origin
        "form-action 'self'",
        
        // Frame sources - restrict to same origin
        "frame-src 'self'",
        
        // Connect sources - allow API endpoints and websockets
        "connect-src 'self' ws: wss:",
        
        // Media sources
        "media-src 'self'",
        
        // Object sources - restrict all
        "object-src 'none'",
        
        // Base URI - restrict to same origin
        "base-uri 'self'"
      ].join('; ');
      
      // Set as report-only if configured (good for testing)
      const cspHeader = config.cspReportOnly ? 
        'Content-Security-Policy-Report-Only' : 
        'Content-Security-Policy';
      
      res.setHeader(cspHeader, cspDirectives);
    }
    
    next();
  };
}

/**
 * Enhanced version of the existing security headers middleware
 * This includes all basic security headers plus additional advanced protections
 */
export function enhancedSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Basic headers (from existing middleware)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Advanced headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=self, microphone=self, camera=self');
  
  // HSTS in production only
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
}