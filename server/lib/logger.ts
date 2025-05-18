import { auditLogs } from "@db/schema";
import { db } from "@db";
import { Request } from "express";
import { AppError } from "./error-handler";

type LogLevel = "info" | "warning" | "error" | "security";
type LogCategory = 
  | "auth" 
  | "user" 
  | "patient" 
  | "provider" 
  | "record" 
  | "system" 
  | "api" 
  | "telehealth";

interface LogOptions {
  userId?: number;
  ipAddress?: string;
  userAgent?: string;
  resourceId?: number;
  resourceType?: string;
  details?: Record<string, any>;
  request?: Request;
}

/**
 * Centralized logging service to maintain security audit trail
 * and standardize logging across the application
 */
export class Logger {
  /**
   * Log an event in the system
   * @param level Log level (info, warning, error, security)
   * @param category System category for the log
   * @param message Descriptive message about the event
   * @param options Additional context for the log entry
   */
  static async log(
    level: LogLevel, 
    category: LogCategory, 
    message: string, 
    options: LogOptions = {}
  ) {
    try {
      const { 
        userId, 
        ipAddress, 
        userAgent, 
        resourceId, 
        resourceType, 
        details, 
        request 
      } = options;

      // Extract request details if provided
      let ip = ipAddress;
      let ua = userAgent;
      
      if (request) {
        ip = ip || this.getClientIp(request);
        ua = ua || request.headers["user-agent"] || "";
      }

      // Sanitize details to remove sensitive information
      const sanitizedDetails = details ? this.sanitizeDetails(details) : undefined;

      // Map our level/category to the format expected by the audit_logs table
      const action = `${level.toUpperCase()}_${category.toUpperCase()}`;
      
      // For audit log compatibility, we need to ensure required fields are present
      // If no userId is provided, we don't log to the database to avoid foreign key issues
      if (!userId) {
        // Only log to console if no user ID (for system actions)
        this.consoleLog(level, category, message, { 
          details: sanitizedDetails
        });
        return; // Exit early - don't try to insert into database
      }
      
      const logEntry = {
        userId: userId, // User ID is required due to foreign key constraint
        action: action,
        resourceType: resourceType || category,
        resourceId: resourceId || 0, // Use 0 for general logs with no specific resource
        details: sanitizedDetails,
        ipAddress: ip,
        userAgent: ua,
        timestamp: new Date()
      };

      // Insert log into database
      await db.insert(auditLogs).values(logEntry);

      // Also log to console for development visibility
      this.consoleLog(level, category, message, { userId, resourceId, resourceType });
    } catch (error) {
      // Fallback to console log if database logging fails
      console.error("Logging error:", error);
      this.consoleLog(level, category, message, { error, userId: options.userId });
    }
  }

  /**
   * Log an authentication event
   */
  static async logAuth(message: string, options: LogOptions = {}) {
    return this.log("info", "auth", message, options);
  }

  /**
   * Log a security event (higher priority)
   */
  static async logSecurity(message: string, options: LogOptions = {}) {
    return this.log("security", "auth", message, options);
  }

  /**
   * Log an error event
   */
  static async logError(error: Error | AppError, category: LogCategory, options: LogOptions = {}) {
    const isAppError = error instanceof AppError;
    const level = isAppError && error.statusCode < 500 ? "warning" : "error";
    
    const message = error.message;
    const details = {
      ...options.details,
      stack: error.stack,
      code: isAppError ? error.code : undefined,
      statusCode: isAppError ? error.statusCode : undefined,
    };

    return this.log(level, category, message, { ...options, details });
  }

  /**
   * Get client IP address from request
   */
  private static getClientIp(req: Request): string | undefined {
    // Get IP from various headers and the request object
    const forwarded = req.headers['x-forwarded-for'] as string;
    if (forwarded) {
      // Get the first IP if there are multiple in the header
      return forwarded.split(',')[0].trim();
    }
    
    return (
      req.headers['x-real-ip'] as string || 
      req.socket.remoteAddress || 
      undefined
    );
  }

  /**
   * Sanitize log details to remove sensitive information
   */
  private static sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized = { ...details };
    
    // List of fields that might contain sensitive information
    const sensitiveFields = [
      'password', 
      'passwordHash', 
      'token', 
      'secret', 
      'authorization', 
      'cookie',
      'ssn',
      'creditCard',
      'apiKey'
    ];
    
    // Recursively sanitize objects
    const sanitizeObject = (obj: Record<string, any>) => {
      Object.keys(obj).forEach(key => {
        // Check if the field name contains any sensitive keywords
        const isSensitive = sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        );
        
        if (isSensitive) {
          // Redact sensitive values
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively sanitize nested objects
          sanitizeObject(obj[key]);
        }
      });
    };
    
    sanitizeObject(sanitized);
    return sanitized;
  }

  /**
   * Output log to console with formatting
   */
  private static consoleLog(
    level: LogLevel, 
    category: LogCategory, 
    message: string, 
    meta: Record<string, any> = {}
  ) {
    const timestamp = new Date().toISOString();
    const logLevel = level.toUpperCase().padEnd(8);
    const categoryStr = category.padEnd(10);
    
    // Format: [TIMESTAMP] LEVEL CATEGORY: Message (metadata)
    const logMessage = `[${timestamp}] ${logLevel} ${categoryStr}: ${message}`;
    
    // Choose console method based on log level
    switch (level) {
      case 'error':
        console.error(logMessage, meta);
        break;
      case 'warning':
        console.warn(logMessage, meta);
        break;
      case 'security':
        console.warn(`🔒 ${logMessage}`, meta);
        break;
      default:
        console.log(logMessage, meta);
    }
  }
}