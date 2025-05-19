/**
 * Security Logger Service for Qualibrite Health
 * 
 * Part of Phase 3 security improvements, this service provides specialized 
 * logging for security events to help with auditing and compliance requirements.
 * 
 * Security events are stored in the audit_logs table with appropriate 
 * categorization for easy filtering and reporting.
 */

import { db } from '@db';
import { auditLogs } from '@db/schema';
import { Logger } from './logger';

type SecurityEventType = 
  | 'AUTH_SUCCESS' 
  | 'AUTH_FAILURE' 
  | 'PASSWORD_CHANGE' 
  | 'MFA_SETUP' 
  | 'MFA_VERIFICATION' 
  | 'ACCOUNT_LOCKED' 
  | 'ACCOUNT_UNLOCKED'
  | 'MEDICAL_RECORD_VIEW'
  | 'MEDICAL_RECORD_CREATE'
  | 'MEDICAL_RECORD_UPDATE'
  | 'MEDICAL_RECORD_DELETE'
  | 'SENSITIVE_DATA_ACCESS'
  | 'PROFILE_UPDATE'
  | 'POTENTIAL_ATTACK'
  | 'SUSPICIOUS_ACTIVITY';

interface SecurityLogOptions {
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  resourceType?: string;
  resourceId?: number | string;
  details?: Record<string, any>;
}

/**
 * Log a security event to the audit_logs table
 * This creates a permanent record of sensitive operations for compliance
 * 
 * @param eventType Type of security event
 * @param message Description of the event
 * @param options Additional details about the event
 */
export async function logSecurityEvent(
  eventType: SecurityEventType,
  message: string,
  options: SecurityLogOptions = {}
): Promise<void> {
  try {
    const { userId, ipAddress, userAgent, resourceType, resourceId, details } = options;
    
    // Add entry to audit_logs table (permanent record)
    await db.insert(auditLogs).values({
      userId: userId || null,
      action: eventType,
      resourceType: resourceType || null,
      resourceId: resourceId ? String(resourceId) : null,
      details: details || {},
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      message
    });
    
    // Also log to application logs for immediate visibility
    Logger.logSecurity(message, {
      details: {
        eventType,
        userId,
        resourceType,
        resourceId,
        ipAddress,
        ...details
      }
    });
  } catch (error) {
    // If audit logging fails, at least try to log to application logs
    Logger.logError(error as Error, 'system', {
      details: { 
        action: 'security_event_logging',
        eventType,
        message,
        options 
      }
    });
  }
}

/**
 * Log a successful authentication
 */
export function logAuthSuccess(userId: number, options: Omit<SecurityLogOptions, 'userId'> = {}): void {
  logSecurityEvent('AUTH_SUCCESS', 'Authentication successful', { 
    userId, 
    ...options 
  });
}

/**
 * Log a failed authentication attempt
 */
export function logAuthFailure(
  message: string, 
  options: SecurityLogOptions = {}
): void {
  logSecurityEvent('AUTH_FAILURE', message, options);
}

/**
 * Log a password change event
 */
export function logPasswordChange(userId: number, options: Omit<SecurityLogOptions, 'userId'> = {}): void {
  logSecurityEvent('PASSWORD_CHANGE', 'Password changed', { 
    userId, 
    ...options 
  });
}

/**
 * Log MFA setup event
 */
export function logMfaSetup(userId: number, options: Omit<SecurityLogOptions, 'userId'> = {}): void {
  logSecurityEvent('MFA_SETUP', 'MFA configured', { 
    userId, 
    ...options 
  });
}

/**
 * Log successful MFA verification
 */
export function logMfaVerification(userId: number, options: Omit<SecurityLogOptions, 'userId'> = {}): void {
  logSecurityEvent('MFA_VERIFICATION', 'MFA verification successful', { 
    userId, 
    ...options 
  });
}

/**
 * Log access to sensitive medical data
 */
export function logSensitiveDataAccess(
  userId: number, 
  resourceType: string, 
  resourceId: number | string,
  options: Omit<SecurityLogOptions, 'userId' | 'resourceType' | 'resourceId'> = {}
): void {
  logSecurityEvent('SENSITIVE_DATA_ACCESS', `Access to ${resourceType} #${resourceId}`, { 
    userId, 
    resourceType, 
    resourceId,
    ...options 
  });
}

/**
 * Log medical record creation
 */
export function logMedicalRecordCreate(
  userId: number, 
  recordId: number,
  options: Omit<SecurityLogOptions, 'userId' | 'resourceType' | 'resourceId'> = {}
): void {
  logSecurityEvent('MEDICAL_RECORD_CREATE', `Medical record created`, { 
    userId, 
    resourceType: 'medical_record', 
    resourceId: recordId,
    ...options 
  });
}

/**
 * Log medical record view
 */
export function logMedicalRecordView(
  userId: number, 
  recordId: number,
  options: Omit<SecurityLogOptions, 'userId' | 'resourceType' | 'resourceId'> = {}
): void {
  logSecurityEvent('MEDICAL_RECORD_VIEW', `Medical record viewed`, { 
    userId, 
    resourceType: 'medical_record', 
    resourceId: recordId,
    ...options 
  });
}

/**
 * Log medical record update
 */
export function logMedicalRecordUpdate(
  userId: number, 
  recordId: number,
  options: Omit<SecurityLogOptions, 'userId' | 'resourceType' | 'resourceId'> = {}
): void {
  logSecurityEvent('MEDICAL_RECORD_UPDATE', `Medical record updated`, { 
    userId, 
    resourceType: 'medical_record', 
    resourceId: recordId,
    ...options 
  });
}

/**
 * Log medical record deletion
 */
export function logMedicalRecordDelete(
  userId: number, 
  recordId: number,
  options: Omit<SecurityLogOptions, 'userId' | 'resourceType' | 'resourceId'> = {}
): void {
  logSecurityEvent('MEDICAL_RECORD_DELETE', `Medical record deleted`, { 
    userId, 
    resourceType: 'medical_record', 
    resourceId: recordId,
    ...options 
  });
}

/**
 * Log suspicious activity
 */
export function logSuspiciousActivity(
  message: string,
  options: SecurityLogOptions = {}
): void {
  logSecurityEvent('SUSPICIOUS_ACTIVITY', message, options);
}

/**
 * Log potential security attack
 */
export function logPotentialAttack(
  message: string,
  options: SecurityLogOptions = {}
): void {
  logSecurityEvent('POTENTIAL_ATTACK', message, options);
}