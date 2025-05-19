/**
 * Input Sanitization Middleware
 * 
 * Part of Phase 3 security improvements for Qualibrite Health.
 * This middleware helps prevent SQL injection and XSS attacks by sanitizing request inputs.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/error-handler';
import { Logger } from '../lib/logger';
import type { LogOptions } from '../lib/logger';

// Characters that might be used in SQL injection or XSS attacks
const SUSPICIOUS_PATTERNS = [
  /('|"|--|\/\*|\*\/|`|;|\$\(|\${)/i, // SQL injection patterns
  /<script.*?>|<\/script>|javascript:|onerror=|onload=|eval\(|setTimeout\(|setInterval\(/i, // XSS patterns
];

/**
 * Sanitize input strings to prevent SQL injection and XSS
 * 
 * @param input String to sanitize
 * @returns Sanitized string with potentially harmful characters escaped
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return input;
  
  // HTML entity encoding for potentially dangerous characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Recursively sanitize all string values in an object
 * 
 * @param obj Object to sanitize
 * @returns Sanitized object with all string values sanitized
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    
    for (const key of Object.keys(obj)) {
      result[key] = sanitizeObject(obj[key]);
    }
    
    return result;
  }
  
  // For numbers, booleans, etc. just return as is
  return obj;
}

/**
 * Check for suspicious patterns that might indicate injection attacks
 * 
 * @param input Input to check
 * @returns Boolean indicating if suspicious patterns were found
 */
export function hasSuspiciousPatterns(input: string): boolean {
  if (typeof input !== 'string') return false;
  
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Recursively check an object for suspicious patterns
 * 
 * @param obj Object to check
 * @returns Boolean indicating if suspicious patterns were found
 */
export function objectHasSuspiciousPatterns(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }
  
  if (typeof obj === 'string') {
    return hasSuspiciousPatterns(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.some(item => objectHasSuspiciousPatterns(item));
  }
  
  if (typeof obj === 'object') {
    return Object.values(obj).some(value => objectHasSuspiciousPatterns(value));
  }
  
  return false;
}

/**
 * Middleware to sanitize request inputs
 * This sanitizes req.body, req.query, and req.params
 */
export function sanitizeInputs(req: Request, res: Response, next: NextFunction): void {
  try {
    // Check for suspicious patterns before sanitizing
    const bodyHasSuspicious = objectHasSuspiciousPatterns(req.body);
    const queryHasSuspicious = objectHasSuspiciousPatterns(req.query);
    const paramsHasSuspicious = objectHasSuspiciousPatterns(req.params);
    
    // Log potential attacks for security monitoring
    if (bodyHasSuspicious || queryHasSuspicious || paramsHasSuspicious) {
      Logger.logSecurity('Potential injection attack detected', {
        details: {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          endpoint: req.path,
          method: req.method,
          body: bodyHasSuspicious ? req.body : undefined,
          query: queryHasSuspicious ? req.query : undefined,
          params: paramsHasSuspicious ? req.params : undefined
        }
      });
    }
    
    // Sanitize inputs
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    
    next();
  } catch (error) {
    Logger.logError(error as Error, 'system', {
      details: { action: 'input_sanitization' }
    });
    next(new AppError('Input sanitization failed', 400, 'VALIDATION_ERROR'));
  }
}

/**
 * Middleware to block requests with suspicious patterns
 * This is a stricter version that blocks potentially malicious requests
 * rather than just sanitizing them
 */
export function blockSuspiciousRequests(req: Request, res: Response, next: NextFunction): void {
  try {
    // Check for suspicious patterns
    const bodyHasSuspicious = objectHasSuspiciousPatterns(req.body);
    const queryHasSuspicious = objectHasSuspiciousPatterns(req.query);
    const paramsHasSuspicious = objectHasSuspiciousPatterns(req.params);
    
    if (bodyHasSuspicious || queryHasSuspicious || paramsHasSuspicious) {
      // Log potential attack
      Logger.logSecurity('Blocked potential injection attack', {
        details: {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          endpoint: req.path,
          method: req.method
        }
      });
      
      // Respond with generic error to avoid giving attackers useful information
      throw new AppError('Invalid request', 400, 'VALIDATION_ERROR');
    }
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      Logger.logError(error as Error, 'system', {
        details: { action: 'block_suspicious_request' }
      });
      next(new AppError('Request validation failed', 400, 'VALIDATION_ERROR'));
    }
  }
}