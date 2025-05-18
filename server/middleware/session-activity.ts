/**
 * Session Activity Middleware
 * 
 * This middleware tracks user session activity and enforces timeout constraints
 * as part of Phase 2 security improvements for Qualibrite Health.
 */

import { Request, Response, NextFunction, Express } from 'express';
import { Logger } from '../lib/logger';

// Session timeout configuration (in milliseconds)
const SESSION_TIMEOUT_CONFIG = {
  DEFAULT: 15 * 60 * 1000,  // 15 minutes for regular users (patients)
  PROVIDER: 10 * 60 * 1000, // 10 minutes for providers
  ADMIN: 5 * 60 * 1000      // 5 minutes for admins
};

/**
 * Determines the appropriate timeout duration based on user role
 */
function getTimeoutDuration(role?: string): number {
  if (!role) return SESSION_TIMEOUT_CONFIG.DEFAULT;
  
  switch (role.toLowerCase()) {
    case 'admin':
      return SESSION_TIMEOUT_CONFIG.ADMIN;
    case 'provider':
      return SESSION_TIMEOUT_CONFIG.PROVIDER;
    default:
      return SESSION_TIMEOUT_CONFIG.DEFAULT;
  }
}

/**
 * Middleware to track session activity and enforce timeouts
 */
function sessionActivityMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip for public routes
  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/health'];
  if (publicRoutes.includes(req.path) || req.path.startsWith('/assets/')) {
    return next();
  }
  
  const session = req.session;
  if (!session) {
    return next();
  }
  
  // Check if the session has a user ID (authenticated)
  if (session.userId) {
    const currentTime = Date.now();
    
    // Check if session has a lastActivity timestamp
    if (session.lastActivity) {
      // Get role from session if available
      const role = typeof session.userRole === 'string' ? session.userRole : 'patient';
      const timeoutDuration = getTimeoutDuration(role);
      const elapsedTime = currentTime - session.lastActivity;
      
      // Check if session has expired
      if (elapsedTime > timeoutDuration) {
        // Session has timed out, destroy it
        session.destroy((err) => {
          if (err) {
            console.error('Error destroying timed-out session:', err);
          }
        });
        
        // Return timeout response
        return res.status(440).json({
          message: 'Your session has expired due to inactivity',
          code: 'SESSION_TIMEOUT'
        });
      }
    }
    
    // Update the last activity timestamp
    session.lastActivity = currentTime;
  }
  
  next();
}

/**
 * Setup session activity tracking for the application
 */
export function setupSessionActivity(app: Express): void {
  // Register the session activity middleware
  app.use(sessionActivityMiddleware);
  
  // Add endpoint to check session activity status
  app.get('/api/auth/session-status', (req, res) => {
    const session = req.session;
    
    if (!session || !session.userId || !session.lastActivity) {
      return res.json({ isActive: false });
    }
    
    const currentTime = Date.now();
    const role = typeof session.userRole === 'string' ? session.userRole : 'patient';
    const timeoutDuration = getTimeoutDuration(role);
    const elapsedTime = currentTime - session.lastActivity;
    const remainingTime = Math.max(0, timeoutDuration - elapsedTime);
    
    res.json({
      isActive: elapsedTime <= timeoutDuration,
      remainingTime: Math.floor(remainingTime / 1000), // in seconds
      totalTimeout: Math.floor(timeoutDuration / 1000)  // in seconds
    });
  });
  
  console.log('Session activity tracking enabled');
}