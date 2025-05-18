import { Router } from "express";
import { authenticateToken, requireSuperadmin, AuthRequest } from "../middleware/auth";
import { asyncHandler, AppError } from "../lib/error-handler";
import { Logger } from "../lib/logger";
import { SecretManager } from "../lib/secret-manager";
import { db } from "@db";
import { auditLogs } from "@db/schema";

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
        user_id: req.user.id,
        action: 'SECURITY_KEY_ROTATION',
        resource_type: 'JWT_SECRET',
        resource_id: null,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'] || 'Unknown',
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

export default router;