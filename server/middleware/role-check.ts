/**
 * Role-based authorization middleware
 * 
 * Part of the security improvements for Qualibrite Health platform
 * This middleware checks if the authenticated user has the required role(s)
 */

import { Request, Response, NextFunction } from 'express';
import { db } from '@db';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '../lib/error-handler';
import { logSecurityAudit, SecurityEventType } from "../lib/security-audit-logger";

/**
 * Middleware to check if user has the admin role
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure user is authenticated and has userId in session
    if (!req.session.userId) {
      await logSecurityAudit(
        SecurityEventType.ACCESS_DENIED,
        "Unauthorized admin access attempt",
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

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.session.userId))
      .limit(1);

    // Check if user exists and has admin role
    if (!user || user.role !== 'admin') {
      await logSecurityAudit(
        SecurityEventType.ACCESS_DENIED,
        "Insufficient privileges for admin access",
        {
          userId: req.session.userId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          sessionId: req.session.id,
          outcome: "failure",
          details: { 
            path: req.path, 
            method: req.method,
            userRole: user?.role || 'unknown'
          }
        }
      );
      return next(new AppError('Insufficient privileges', 403));
    }

    // User has admin role, continue
    next();
  } catch (error) {
    next(new AppError('Authorization check failed', 500));
  }
};

/**
 * Middleware to check if user has one of the specified roles
 * @param roles Array of allowed roles
 */
export const hasRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure user is authenticated and has userId in session
      if (!req.session.userId) {
        await logSecurityAudit(
          SecurityEventType.ACCESS_DENIED,
          "Unauthorized role-based access attempt",
          {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            sessionId: req.session.id,
            outcome: "failure",
            details: { 
              path: req.path, 
              method: req.method,
              requiredRoles: roles
            }
          }
        );
        return next(new AppError('Authentication required', 401));
      }

      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId))
        .limit(1);

      // Check if user exists and has one of the required roles
      if (!user || !roles.includes(user.role)) {
        await logSecurityAudit(
          SecurityEventType.ACCESS_DENIED,
          "Insufficient privileges for role-based access",
          {
            userId: req.session.userId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            sessionId: req.session.id,
            outcome: "failure",
            details: { 
              path: req.path, 
              method: req.method,
              userRole: user?.role || 'unknown',
              requiredRoles: roles
            }
          }
        );
        return next(new AppError('Insufficient privileges', 403));
      }

      // User has required role, continue
      next();
    } catch (error) {
      next(new AppError('Authorization check failed', 500));
    }
  };
};