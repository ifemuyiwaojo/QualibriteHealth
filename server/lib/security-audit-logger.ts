/**
 * Security Audit Logger
 * 
 * Part of Phase 4 Security Improvements for Qualibrite Health
 * Provides comprehensive security event logging with detailed contextual information
 */

import { db } from '@db';
import { auditLogs } from '@db/schema';

/**
 * Security Event Types
 * Categorizes different types of security events for better analysis
 */
export enum SecurityEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  
  // MFA events
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  MFA_SETUP = 'MFA_SETUP',
  MFA_VERIFIED = 'MFA_VERIFIED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  
  // Authorization events
  ACCESS_DENIED = 'ACCESS_DENIED',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  PERMISSION_CHANGE = 'PERMISSION_CHANGE',
  
  // Data access events
  PHI_ACCESS = 'PHI_ACCESS',
  PHI_EXPORT = 'PHI_EXPORT',
  PHI_MODIFICATION = 'PHI_MODIFICATION',
  PHI_DELETION = 'PHI_DELETION',
  
  // System events
  CONFIGURATION_CHANGE = 'CONFIGURATION_CHANGE',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  API_USAGE = 'API_USAGE',
  
  // Account management
  ACCOUNT_CREATION = 'ACCOUNT_CREATION',
  ACCOUNT_MODIFICATION = 'ACCOUNT_MODIFICATION',
  ACCOUNT_LOCKOUT = 'ACCOUNT_LOCKOUT',
  ACCOUNT_UNLOCK = 'ACCOUNT_UNLOCK',
  
  // Security-specific events
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SECURITY_SCAN = 'SECURITY_SCAN',
  
  // Miscellaneous
  OTHER = 'OTHER'
}

/**
 * Severity levels for security events
 */
export enum SecurityEventSeverity {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

/**
 * Outcome of a security event
 */
export enum SecurityEventOutcome {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Optional audit log parameters
 */
interface SecurityAuditOptions {
  userId?: number;
  targetUserId?: number;
  resourceId?: number;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  outcome?: string;
  details?: Record<string, any>;
}

/**
 * Log a security audit event
 * 
 * @param eventType Type of security event
 * @param message Human-readable message describing the event
 * @param options Additional contextual information about the event
 */
export async function logSecurityAudit(
  eventType: SecurityEventType,
  message: string,
  options: SecurityAuditOptions = {}
): Promise<void> {
  try {
    // Determine severity based on event type
    let severity = SecurityEventSeverity.INFO;
    
    // Set severity based on event type
    if (eventType.includes('FAILURE') || 
        eventType === SecurityEventType.ACCESS_DENIED || 
        eventType === SecurityEventType.ACCOUNT_LOCKOUT) {
      severity = SecurityEventSeverity.WARNING;
    }
    
    if (eventType === SecurityEventType.PRIVILEGE_ESCALATION || 
        eventType === SecurityEventType.BRUTE_FORCE_ATTEMPT ||
        eventType === SecurityEventType.SUSPICIOUS_ACTIVITY) {
      severity = SecurityEventSeverity.ERROR;
    }
    
    if (eventType === SecurityEventType.SYSTEM_ERROR) {
      severity = SecurityEventSeverity.CRITICAL;
    }
    
    // Insert audit log entry
    await db.insert(auditLogs).values({
      userId: options.userId,
      action: message,
      resourceType: 'security_event', // Default resource type for security events
      resourceId: options.resourceId || 0,
      details: {
        eventType,
        severity,
        targetUserId: options.targetUserId,
        sessionId: options.sessionId,
        outcome: options.outcome || SecurityEventOutcome.UNKNOWN,
        ...options.details
      },
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
      timestamp: new Date()
    });
  } catch (error) {
    // Log to console if database logging fails
    console.error('Failed to log security audit:', {
      eventType,
      message,
      options,
      error
    });
  }
}