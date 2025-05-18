import { Request, Response, NextFunction } from "express";
import { db } from "@db";
import { auditLogs } from "@db/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { AuthRequest } from "../middleware/auth";

// Standard error response format
interface ErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

// Extended error class with status code and optional code field
export class AppError extends Error {
  statusCode: number;
  code?: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Log error to the database for security auditing
export const logError = async (
  req: Request | AuthRequest, 
  error: Error, 
  userId?: number
) => {
  try {
    // Try to get userId from AuthRequest
    const authReq = req as AuthRequest;
    if (!userId && authReq.user && authReq.user.id) {
      userId = authReq.user.id;
    }

    // Only log to audit logs if we have a user ID
    if (userId) {
      await db.insert(auditLogs).values({
        userId,
        action: 'error',
        resourceType: 'system',
        resourceId: 0,
        details: {
          message: error.message,
          path: req.path,
          method: req.method,
          // Sanitize request body to remove sensitive data like passwords
          body: sanitizeRequestBody(req.body || {}),
          // Include only a subset of headers that are relevant and not sensitive
          headers: {
            'user-agent': req.headers['user-agent'],
            'content-type': req.headers['content-type'],
            'referer': req.headers['referer']
          }
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] as string
      });
    }
  } catch (logError) {
    console.error('Failed to log error to audit logs:', logError);
  }
};

// Sanitize request body to remove sensitive information before logging
const sanitizeRequestBody = (body: any): any => {
  if (!body) return {};
  
  // Create a copy to avoid mutating the original
  const sanitized = { ...body };
  
  // Remove known sensitive fields
  const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'currentPassword', 'newPassword'];
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

// Format and handle Zod validation errors
export const handleZodError = (error: ZodError): ErrorResponse => {
  const validationError = fromZodError(error);
  return {
    message: 'Validation error',
    code: 'VALIDATION_ERROR',
    details: validationError.message
  };
};

// Main error handler middleware
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log all errors to console in dev environment
  console.error(`[ERROR] ${err.stack || err.message}`);
  
  // Default error response
  let errorResponse: ErrorResponse = {
    message: 'Something went wrong'
  };
  
  let statusCode = 500;
  
  // Handle different types of errors
  if (err instanceof ZodError) {
    errorResponse = handleZodError(err);
    statusCode = 400;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorResponse = {
      message: err.message,
      code: err.code
    };
    
    // Only include details in development environment
    if (process.env.NODE_ENV !== 'production' && !err.isOperational) {
      errorResponse.details = err.stack;
    }
  } else {
    // For unhandled errors, we don't expose details in production
    errorResponse.message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message;
  }
  
  // Log error to audit logs if we can determine the user
  const authReq = req as AuthRequest;
  if (authReq.user) {
    logError(req, err, authReq.user.id);
  }
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async handler to catch errors in async route handlers
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};