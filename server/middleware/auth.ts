/**
 * Authentication middleware for Qualibrite Health
 * 
 * This middleware provides authentication checks for protected routes
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/error-handler';
import { logSecurityAudit, SecurityEventType } from '../lib/security-audit-logger';

// Extend Request to include user info for authenticated requests
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    [key: string]: any;
  };
}

/**
 * Middleware to check if a user is authenticated
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    // Log the failed authentication attempt
    await logSecurityAudit(
      SecurityEventType.AUTHENTICATION_FAILURE,
      "Authentication required",
      {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId: req.session.id,
        outcome: "failure",
        details: { path: req.path, method: req.method }
      }
    );
    return next(new AppError('Authentication required', 401));
  }
  next();
};

/**
 * Legacy JWT token authentication
 * This is kept for backward compatibility with existing routes
 */
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // This now uses session-based authentication instead of JWT
  if (!req.session.userId) {
    await logSecurityAudit(
      SecurityEventType.AUTHENTICATION_FAILURE,
      "Authentication required",
      {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId: req.session.id,
        outcome: "failure",
        details: { path: req.path, method: req.method }
      }
    );
    return next(new AppError('Authentication required', 401));
  }
  
  // Set user property on request for backward compatibility
  req.user = {
    id: req.session.userId,
    email: req.session.email || '',
    role: req.session.role || 'patient'
  };
  
  next();
};

/**
 * Middleware to check if a user has one of the specified roles
 * This is kept for backward compatibility with existing routes
 */
export const authorizeRoles = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      await logSecurityAudit(
        SecurityEventType.AUTHENTICATION_FAILURE,
        "Authentication required for role check",
        {
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          sessionId: req.session.id,
          outcome: "failure",
          details: { path: req.path, method: req.method }
        }
      );
      return next(new AppError('Authentication required', 401));
    }

    // Allow superadmins access to all routes regardless of roles specified
    if (req.user.isSuperadmin) {
      return next();
    }
    
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      await logSecurityAudit(
        SecurityEventType.ACCESS_DENIED,
        "Insufficient privileges",
        {
          userId: req.session.userId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          sessionId: req.session.id,
          outcome: "failure",
          details: { 
            path: req.path, 
            method: req.method,
            userRole: req.user.role,
            requiredRoles: roles
          }
        }
      );
      return next(new AppError('Insufficient privileges', 403));
    }

    next();
  };
};

/**
 * Middleware to check if a user is authenticated with MFA
 */
export const isMfaAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    await logSecurityAudit(
      SecurityEventType.AUTHENTICATION_FAILURE,
      "Authentication required",
      {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId: req.session.id,
        outcome: "failure",
        details: { path: req.path, method: req.method }
      }
    );
    return next(new AppError('Authentication required', 401));
  }

  // Check if MFA is completed if required
  if (req.session.mfaRequired && !req.session.mfaCompleted) {
    await logSecurityAudit(
      SecurityEventType.MFA_REQUIRED,
      "MFA authentication required",
      {
        userId: req.session.userId,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        sessionId: req.session.id,
        outcome: "failure",
        details: { path: req.path, method: req.method }
      }
    );
    return next(new AppError('MFA authentication required', 403));
  }

  next();
};