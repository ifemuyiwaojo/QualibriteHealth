/**
 * Security Audit Logger
 * 
 * Part of Phase 4 security improvements for Qualibrite Health.
 * This module provides comprehensive security event logging with
 * structured data format suitable for analysis and compliance reporting.
 */

import { Logger } from './logger';
import { db } from '@db';
import { auditLogs } from '@db/schema';
import { Request } from 'express';

// Security event types for categorization
export enum SecurityEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  MFA_CHALLENGE = 'MFA_CHALLENGE',
  
  // Access control events
  ACCESS_DENIED = 'ACCESS_DENIED',
  PRIVILEGE_CHANGE = 'PRIVILEGE_CHANGE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  
  // Data security events
  PHI_ACCESS = 'PHI_ACCESS',
  PHI_EXPORT = 'PHI_EXPORT',
  RECORD_CREATED = 'RECORD_CREATED',
  RECORD_UPDATED = 'RECORD_UPDATED',
  RECORD_DELETED = 'RECORD_DELETED',
  
  // System security events
  SECURITY_CONFIG_CHANGE = 'SECURITY_CONFIG_CHANGE',
  SECRET_ROTATION = 'SECRET_ROTATION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  
  // Admin actions
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_LOCKED = 'USER_LOCKED',
  USER_UNLOCKED = 'USER_UNLOCKED'
}

// Security severity levels
export enum SecuritySeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

interface SecurityAuditOptions {
  // Who performed the action (user ID)
  userId?: number;
  
  // Target of the action (if applicable)
  targetUserId?: number;
  
  // IP address of the client
  ipAddress?: string;
  
  // User agent string
  userAgent?: string;
  
  // Unique session identifier
  sessionId?: string;
  
  // Results or outcome of the action
  outcome?: 'success' | 'failure' | 'denied' | 'warning';
  
  // Severity level of the event
  severity?: SecuritySeverity;
  
  // Additional structured data relevant to the event
  details?: Record<string, any>;
  
  // Resource identifier (like a medical record ID)
  resourceId?: number | string;
  
  // Resource type (like 'medical_record', 'patient', etc)
  resourceType?: string;
}

/**
 * Log a security audit event with detailed information
 * 
 * @param eventType Type of security event from SecurityEventType enum
 * @param message Human-readable description of the event
 * @param options Additional event details and metadata
 */
export async function logSecurityAudit(
  eventType: SecurityEventType,
  message: string,
  options: SecurityAuditOptions
): Promise<void> {
  try {
    // Default severity based on event type if not specified
    if (!options.severity) {
      options.severity = getDefaultSeverity(eventType);
    }
    
    // Log to database - use the updated schema with event_type column
    await db.insert(auditLogs).values({
      event_type: eventType, // Column renamed from 'action' to 'event_type'
      message,
      userId: options.userId,
      target_user_id: options.targetUserId, // New column
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      session_id: options.sessionId, // New column
      outcome: options.outcome, // New column
      severity: options.severity, // New column
      details: options.details,
      resource_id: options.resourceId?.toString(),
      resource_type: options.resourceType,
      timestamp: new Date() // Using timestamp instead of createdAt
    });
    
    // Also log to application logs for immediate visibility
    Logger.logSecurity(message, { 
      details: {
        eventType,
        userId: options.userId,
        targetUserId: options.targetUserId,
        severity: options.severity,
        outcome: options.outcome,
        resourceType: options.resourceType,
        resourceId: options.resourceId
      }
    });
  } catch (error) {
    // If database logging fails, at least log to application logs
    Logger.logError(error as Error, 'system', {
      details: { 
        context: 'security_audit_logging',
        eventType,
        message,
        ...options
      }
    });
  }
}

/**
 * Extract basic security context from a request object
 * 
 * @param req Express request object
 * @returns Object with extracted security context
 */
export function getSecurityContextFromRequest(req: Request): Pick<SecurityAuditOptions, 'ipAddress' | 'userAgent' | 'sessionId' | 'userId'> {
  return {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    sessionId: req.session?.id,
    userId: req.session?.userId
  };
}

/**
 * Get default severity level based on event type
 * 
 * @param eventType Security event type
 * @returns Appropriate severity level
 */
function getDefaultSeverity(eventType: SecurityEventType): SecuritySeverity {
  switch (eventType) {
    // Critical severity events
    case SecurityEventType.BRUTE_FORCE_ATTEMPT:
    case SecurityEventType.SUSPICIOUS_ACTIVITY:
      return SecuritySeverity.CRITICAL;
      
    // High severity events
    case SecurityEventType.LOGIN_FAILURE:
    case SecurityEventType.ACCESS_DENIED:
    case SecurityEventType.USER_LOCKED:
    case SecurityEventType.PHI_EXPORT:
      return SecuritySeverity.HIGH;
      
    // Medium severity events
    case SecurityEventType.PASSWORD_CHANGE:
    case SecurityEventType.PASSWORD_RESET:
    case SecurityEventType.PRIVILEGE_CHANGE:
    case SecurityEventType.ROLE_CHANGE:
    case SecurityEventType.MFA_DISABLED:
    case SecurityEventType.RECORD_DELETED:
      return SecuritySeverity.MEDIUM;
      
    // Low severity events
    case SecurityEventType.MFA_ENABLED:
    case SecurityEventType.PHI_ACCESS:
    case SecurityEventType.RECORD_UPDATED:
    case SecurityEventType.SECRET_ROTATION:
    case SecurityEventType.USER_UNLOCKED:
      return SecuritySeverity.LOW;
      
    // Informational events
    case SecurityEventType.LOGIN_SUCCESS:
    case SecurityEventType.LOGOUT:
    case SecurityEventType.RECORD_CREATED:
    case SecurityEventType.MFA_CHALLENGE:
    case SecurityEventType.USER_CREATED:
    case SecurityEventType.USER_UPDATED:
    case SecurityEventType.SECURITY_CONFIG_CHANGE:
    default:
      return SecuritySeverity.INFO;
  }
}