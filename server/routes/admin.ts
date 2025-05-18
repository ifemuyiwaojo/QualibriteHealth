import { Router } from "express";
import { authenticateToken, requireSuperadmin, AuthRequest } from "../middleware/auth";
import { asyncHandler, AppError } from "../lib/error-handler";
import { Logger } from "../lib/logger";
import { SecretManager } from "../lib/secret-manager";
import { db } from "@db";
import { auditLogs } from "@db/schema";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * Route to rotate the JWT secret
 * This is a highly privileged operation that should only be accessible to superadmins.
 * After rotating the secret, all new tokens will be signed with the new secret,
 * but existing tokens will remain valid for the specified expiry period.
 */
router.post("/rotate-secret", authenticateToken, requireSuperadmin, asyncHandler(async (req: AuthRequest, res) => {
  try {
    const { expiryDays } = req.body;
    
    // Default to 30 days if not specified
    const gracePeriod = expiryDays ? parseInt(expiryDays) : 30;
    
    if (isNaN(gracePeriod) || gracePeriod < 1 || gracePeriod > 90) {
      throw new AppError("Expiry days must be a number between 1 and 90", 400, "INVALID_PARAMETER");
    }
    
    // Get secret manager instance
    const secretManager = SecretManager.getInstance();
    
    // Rotate the secret
    const newSecret = secretManager.rotateSecret(gracePeriod);
    
    // Log the rotation for audit trail
    if (req.user) {
      await Logger.log("security", "system", `JWT secret rotated by superadmin`, { 
        userId: req.user.id,
        request: req,
        details: { 
          gracePeriod,
          rotatedAt: new Date().toISOString()
        }
      });
      
      // Also log this to the audit_logs table for compliance tracking
      const auditData = {
        userId: req.user.id,
        action: 'SECURITY_KEY_ROTATION',
        resourceType: 'JWT_SECRET',
        resourceId: null,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'Unknown',
        details: JSON.stringify({
          description: 'JWT secret rotation performed',
          gracePeriod: `${gracePeriod} days`,
          timestamp: new Date().toISOString()
        })
      };
      
      try {
        await db.insert(auditLogs).values(auditData);
      } catch (auditError) {
        // Don't fail the request if audit logging fails, but log the error
        Logger.logError(auditError instanceof Error ? auditError : new Error(String(auditError)), 
          "system", { 
            details: { 
              operation: "JWT secret rotation audit logging",
              userId: req.user.id
            } 
          });
      }
    }
    
    res.status(200).json({ 
      message: "JWT secret rotated successfully", 
      expiry: `Previous tokens will remain valid for ${gracePeriod} days` 
    });
  } catch (error) {
    // Log the error
    Logger.logError(error instanceof Error ? error : new Error(String(error)), 
      "system", { request: req });
      
    // Re-throw to let the error handler middleware handle it
    throw error;
  }
}));

/**
 * Route to get the current status of secrets
 * Only shows count and age information, never the actual secrets
 */
router.get("/secret-status", authenticateToken, requireSuperadmin, asyncHandler(async (req: AuthRequest, res) => {
  try {
    // Get secret manager instance
    const secretManager = SecretManager.getInstance();
    
    // Get status information (we'll need to add this method to SecretManager)
    const status = secretManager.getStatus();
    
    res.status(200).json(status);
  } catch (error) {
    // Log the error
    Logger.logError(error instanceof Error ? error : new Error(String(error)), 
      "system", { request: req });
      
    // Re-throw to let the error handler middleware handle it
    throw error;
  }
}));

/**
 * Testing endpoint for JWT secret rotation
 * Only accessible by superadmins for testing purposes
 */
router.get("/test-jwt-rotation", authenticateToken, requireSuperadmin, asyncHandler(async (req: AuthRequest, res) => {
  try {
    // Get secret manager instance
    const secretManager = SecretManager.getInstance();
    
    // 1. Get the current secret
    const originalSecret = secretManager.getCurrentSecret();
    
    // 2. Create a test token with the current secret
    const testPayload = {
      id: 999,
      email: "test@example.com",
      role: "test"
    };
    
    const originalToken = jwt.sign(testPayload, originalSecret, { expiresIn: '1h' });
    
    // 3. Rotate the secret with 7 day grace period
    const newSecret = secretManager.rotateSecret(7);
    
    // 4. Verify the original token can still be verified using the verification algorithm
    const validSecrets = secretManager.getAllValidSecrets();
    
    let originalTokenValid = false;
    let originalTokenError: Error | null = null;
    
    for (const secret of validSecrets) {
      try {
        const decoded = jwt.verify(originalToken, secret);
        originalTokenValid = true;
        break;
      } catch (err) {
        originalTokenError = err as Error;
        // Continue to next secret
      }
    }
    
    // 5. Create a new token with new secret
    const newToken = jwt.sign(testPayload, secretManager.getCurrentSecret(), { expiresIn: '1h' });
    
    // 6. Verify the new token
    let newTokenValid = false;
    let newTokenError: Error | null = null;
    
    try {
      const decoded = jwt.verify(newToken, secretManager.getCurrentSecret());
      newTokenValid = true;
    } catch (err) {
      newTokenError = err as Error;
    }
    
    // Get secret status for reporting
    const status = secretManager.getStatus();
    
    // Log the test results
    await Logger.log("security", "system", "JWT rotation test completed", {
      userId: req.user?.id,
      request: req,
      details: {
        originalTokenValid,
        newTokenValid,
        secretCount: validSecrets.length,
        errorMessages: {
          originalTokenError: originalTokenError ? originalTokenError.message : null,
          newTokenError: newTokenError ? newTokenError.message : null
        }
      }
    });
    
    res.status(200).json({
      message: "JWT rotation test completed",
      results: {
        originalTokenValid,
        newTokenValid,
        secretsCount: validSecrets.length,
        secretStatus: status
      }
    });
  } catch (error) {
    Logger.logError(error instanceof Error ? error : new Error(String(error)), 
      "system", { request: req });
    throw error;
  }
}));

export default router;