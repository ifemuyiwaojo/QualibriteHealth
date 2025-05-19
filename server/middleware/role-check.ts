/**
 * Role-based authorization middleware
 * Provides access control based on user roles
 */

import { Request, Response, NextFunction } from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { logSecurityAudit, SecurityEventType } from "../lib/security-audit-logger";

/**
 * Check if a user has admin/superadmin privileges
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get user from database to ensure accurate role check
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.session.userId));

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the user has admin privileges
    if (user.role !== "admin" && !user.isSuperadmin) {
      // Log unauthorized access attempt
      await logSecurityAudit(
        SecurityEventType.ACCESS_DENIED,
        "Admin access denied - insufficient privileges",
        {
          userId: req.session.userId,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          sessionId: req.sessionID,
          outcome: "FAILURE",
          details: {
            requiredRole: "admin",
            userRole: user.role,
            isSuperadmin: user.isSuperadmin,
            path: req.path,
            method: req.method
          }
        }
      );

      return res.status(403).json({ message: "Insufficient privileges" });
    }

    // User has admin privileges, proceed
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Middleware to check if the user has one of the specified roles
 * @param roles Array of role names that are allowed
 */
export const hasRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.session.userId));

      if (!user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Superadmins always have access to everything
      if (user.isSuperadmin) {
        return next();
      }

      // Check if the user's role is in the allowed roles
      if (!roles.includes(user.role)) {
        // Log unauthorized access attempt
        await logSecurityAudit(
          SecurityEventType.ACCESS_DENIED,
          "Role-based access denied",
          {
            userId: req.session.userId,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            sessionId: req.sessionID,
            outcome: "FAILURE",
            details: {
              requiredRoles: roles,
              userRole: user.role,
              path: req.path,
              method: req.method
            }
          }
        );

        return res.status(403).json({ message: "Insufficient privileges" });
      }

      // User has appropriate role, proceed
      next();
    } catch (error) {
      console.error("Error in hasRole middleware:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};