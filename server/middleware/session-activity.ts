/**
 * Session Activity Middleware
 * 
 * This middleware tracks user activity and implements automatic session timeout
 * after a specified period of inactivity to enhance security.
 * 
 * It follows healthcare security best practices by ensuring sessions are
 * terminated when users have been inactive, preventing unauthorized access.
 */

import { Request, Response, NextFunction } from "express";
import { Logger } from "../lib/logger";
import { AuthRequest } from "./auth";
import session from "express-session";

// Extend the express-session SessionData interface
declare module "express-session" {
  interface SessionData {
    userId: number;
    lastActivity: number;
  }
}

// Constants for session activity tracking
const ACTIVITY_KEY = 'lastActivity';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity (in milliseconds)

/**
 * Middleware to track user activity and implement automatic session timeout
 */
export const sessionActivityTracker = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Skip tracking for static assets, health checks, and login/register
  const skipPaths = ['/favicon.ico', '/api/health', '/api/auth/login', '/api/auth/register'];
  if (skipPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Check if the session exists
  if (req.session) {
    const now = Date.now();
    
    // Check the last activity time
    const lastActivity = req.session[ACTIVITY_KEY] as number;
    
    // If there's a recorded last activity and the user's session has timed out
    if (lastActivity && (now - lastActivity > INACTIVITY_TIMEOUT) && req.user) {
      // Log the session timeout for audit trail
      Logger.log('security', 'auth', 'Session timed out due to inactivity', {
        userId: req.user.id,
        request: req,
        details: {
          lastActivityTime: new Date(lastActivity).toISOString(),
          currentTime: new Date(now).toISOString(),
          inactiveMinutes: Math.floor((now - lastActivity) / (60 * 1000))
        }
      });
      
      // Clear cookies
      res.clearCookie('token');
      
      // Reset/destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session on timeout:', err);
        }
      });
      
      // Return an unauthorized response
      return res.status(401).json({
        message: 'Session expired due to inactivity',
        code: 'SESSION_TIMEOUT'
      });
    }
    
    // Update the last activity time for the current request
    req.session[ACTIVITY_KEY] = now;
  }
  
  // Continue with the request
  next();
};

/**
 * Sets up and configures the session management middleware
 */
export function setupSessionActivity(app: any) {
  // Apply the session activity tracker middleware
  app.use(sessionActivityTracker);
  
  // Return a success indicator for configuration
  return true;
}