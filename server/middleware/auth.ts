import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import { Logger } from "../lib/logger";
import { AppError } from "../lib/error-handler";
import { SecretManager } from "../lib/secret-manager";

// SecretManager will throw an error if JWT_SECRET is not set
// This is handled at instantiation of the SecretManager

// Extend the session interface to include our custom properties
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    isSuperadmin: boolean;
    changePasswordRequired: boolean;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // First check session
    if (req.session && req.session.userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.session.userId),
      });

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          isSuperadmin: user.isSuperadmin || false,
          changePasswordRequired: user.changePasswordRequired || false,
        };
        
        // Log successful session authentication
        await Logger.log("info", "auth", "Session authentication successful", {
          userId: user.id,
          request: req
        });
        
        return next();
      } else {
        // Session contains userId but user not found - potential security issue
        await Logger.log("security", "auth", "Session contains invalid userId", {
          userId: req.session.userId,
          request: req
        });
      }
    }

    // Fallback to JWT token
    const token = req.cookies.token;
    if (!token) {
      // Only console log for unauthenticated requests since we can't link to a user
      console.warn(`[${new Date().toISOString()}] WARNING auth: Authentication failed: No token provided`, {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get secret manager instance
    const secretManager = SecretManager.getInstance();
    
    // Try to verify with all valid secrets (supports secret rotation)
    let decoded: any = null;
    let isValid = false;
    
    // Get all valid secrets (current and not-yet-expired previous ones)
    const validSecrets = secretManager.getAllValidSecrets();
    
    // Try each secret until one works or all fail
    for (const secret of validSecrets) {
      try {
        decoded = jwt.verify(token, secret) as {
          id: number;
          email: string;
          role: string;
        };
        isValid = true;
        break;
      } catch (err) {
        // Continue to next secret
      }
    }
    
    if (!isValid || !decoded) {
      // If all secrets failed, token is invalid
      await Logger.log("security", "auth", "JWT authentication failed: Invalid token", {
        request: req
      });
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      await Logger.log("security", "auth", "JWT authentication failed: User not found", {
        request: req,
        details: { decodedId: decoded.id, decodedEmail: decoded.email }
      });
      return res.status(401).json({ message: "User not found" });
    }

    // Set session for future requests
    if (req.session) {
      req.session.userId = user.id;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isSuperadmin: user.isSuperadmin || false,
      changePasswordRequired: user.changePasswordRequired || false,
    };

    // Log successful JWT authentication
    await Logger.log("info", "auth", "JWT authentication successful", {
      userId: user.id,
      request: req
    });

    next();
  } catch (error) {
    // Log authentication error
    if (error instanceof jwt.JsonWebTokenError) {
      await Logger.log("security", "auth", `JWT authentication failed: ${error.message}`, {
        request: req,
        details: { errorType: error.name }
      });
    } else {
      await Logger.logError(error instanceof Error ? error : new Error(String(error)),
        "auth", { request: req });
    }
    
    // Clear invalid token/session
    res.clearCookie("token");
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          Logger.logError(err instanceof Error ? err : new Error(String(err)), 
            "system", { request: req });
        }
      });
    }
    
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      // Only console log for unauthenticated requests
      console.warn(`[${new Date().toISOString()}] WARNING auth: Role authorization failed: User not authenticated`, {
        path: req.path,
        method: req.method,
        requiredRoles: roles.join(", ")
      });
      return res.status(401).json({ message: "Authentication required" });
    }

    // Allow superadmin access to everything
    if (req.user.isSuperadmin) {
      await Logger.log("info", "auth", "Superadmin access granted", { 
        userId: req.user.id,
        request: req,
        details: { requiredRoles: roles.join(", ") }
      });
      return next();
    }

    // For non-superadmins, check role permissions
    if (!roles.includes(req.user.role)) {
      await Logger.log("security", "auth", "Access denied: Insufficient permissions", { 
        userId: req.user.id,
        request: req,
        details: { 
          userRole: req.user.role,
          requiredRoles: roles.join(", "),
          path: req.path,
          method: req.method
        }
      });
      return res.status(403).json({ message: "Access denied" });
    }

    // Log successful authorization
    await Logger.log("info", "auth", "Role-based access granted", { 
      userId: req.user.id,
      request: req,
      details: { 
        userRole: req.user.role,
        requiredRoles: roles.join(", ")
      }
    });

    next();
  };
};

// Add a superadmin check middleware with improved logging
export const requireSuperadmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    // Only console log for unauthenticated requests
    console.warn(`[${new Date().toISOString()}] WARNING auth: Superadmin check failed: User not authenticated`, {
      path: req.path,
      method: req.method
    });
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (!req.user.isSuperadmin) {
    await Logger.log("security", "auth", "Superadmin access denied", { 
      userId: req.user.id,
      request: req,
      details: { 
        userRole: req.user.role,
        path: req.path,
        method: req.method
      }
    });
    return res.status(403).json({ message: "Superadmin access required" });
  }
  
  await Logger.log("info", "auth", "Superadmin access granted", { 
    userId: req.user.id,
    request: req
  });
  
  next();
};