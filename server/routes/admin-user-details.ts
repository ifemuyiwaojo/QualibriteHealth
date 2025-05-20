/**
 * Admin User Details Routes
 * These routes provide detailed user information for administrators
 * Part of the security management and monitoring features
 */

import express from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq, SQL } from "drizzle-orm";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/auth";

const router = express.Router();

/**
 * Get detailed user information including security settings
 * GET /api/admin/user-details?userId=123
 * Returns detailed information about a specific user
 */
router.get("/user-details", authenticateToken, authorizeRoles("admin", "superadmin", "it_support"), async (req: AuthRequest, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : null;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required"
      });
    }

    // Get detailed user information
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        isSuperadmin: users.isSuperadmin,
        changePasswordRequired: users.changePasswordRequired,
        failedLoginAttempts: users.failedLoginAttempts,
        accountLocked: users.accountLocked,
        lastFailedLogin: users.lastFailedLogin,
        lockExpiresAt: users.lockExpiresAt,
        mfaEnabled: users.mfaEnabled,
        emailVerified: users.emailVerified,
        metadata: users.metadata,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Format the response for easier consumption
    const userDetails = {
      id: user.id,
      email: user.email,
      role: user.role,
      isSuperadmin: user.isSuperadmin,
      security: {
        passwordStatus: user.changePasswordRequired ? "temporary" : "permanent",
        mfaEnabled: !!user.mfaEnabled,
        emailVerified: !!user.emailVerified,
        accountLocked: !!user.accountLocked,
        failedLoginAttempts: user.failedLoginAttempts || 0,
        lastFailedLogin: user.lastFailedLogin,
        lockExpiresAt: user.lockExpiresAt,
        mfaRequired: user.metadata?.mfaRequired === true
      },
      metadata: user.metadata || {},
      dates: {
        created: user.createdAt,
        updated: user.updatedAt
      }
    };

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user details"
    });
  }
});

/**
 * Get bulk security information about users 
 * GET /api/admin/security-summary?role=patient
 * Returns summary of security status for users with the specified role
 */
router.get("/security-summary", authenticateToken, authorizeRoles("admin", "superadmin", "it_support"), async (req: AuthRequest, res) => {
  try {
    const role = req.query.role as string;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role parameter is required"
      });
    }

    // Query to get security data for all users of a specific role
    // Use SQL template literal for role filtering
    const userSummaries = await db
      .select({
        id: users.id,
        email: users.email,
        passwordStatus: users.changePasswordRequired,
        mfaEnabled: users.mfaEnabled,
        failedLoginAttempts: users.failedLoginAttempts,
        accountLocked: users.accountLocked,
        lastFailedLogin: users.lastFailedLogin,
        lockExpiresAt: users.lockExpiresAt,
        metadata: users.metadata
      })
      .from(users)
      .where(eq(users.role, role as any));

    // Format the response into a more usable structure
    const securitySummary = userSummaries.map(user => ({
      id: user.id,
      email: user.email,
      passwordType: user.passwordStatus ? "temporary" : "permanent",
      mfaEnabled: !!user.mfaEnabled,
      mfaRequired: user.metadata?.mfaRequired === true,
      accountLocked: !!user.accountLocked,
      failedLoginAttempts: user.failedLoginAttempts || 0,
      lastFailedLogin: user.lastFailedLogin,
      lockExpiresAt: user.lockExpiresAt
    }));

    return res.status(200).json(securitySummary);
  } catch (error) {
    console.error("Error fetching security summary:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve security summary"
    });
  }
});

/**
 * Update a user's MFA requirement
 * PATCH /api/admin/update-mfa-requirement
 * Body: { userId: number, requireMfa: boolean }
 */
router.patch("/update-mfa-requirement", authenticateToken, authorizeRoles("admin", "superadmin"), async (req: AuthRequest, res) => {
  try {
    const { userId, requireMfa } = req.body;

    if (!userId || typeof requireMfa !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "User ID and MFA requirement flag are required"
      });
    }

    // Get the user's current metadata
    const [user] = await db
      .select({
        metadata: users.metadata
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update the metadata with the new MFA requirement
    const updatedMetadata = {
      ...(user.metadata || {}),
      mfaRequired: requireMfa
    };

    // If we're removing the MFA requirement and user has it enabled, 
    // don't force disable it. Just make it optional.
    // If it's already disabled, no changes would be needed to mfaEnabled.
    
    // Update the user record
    await db
      .update(users)
      .set({
        metadata: updatedMetadata
      })
      .where(eq(users.id, userId));

    return res.status(200).json({
      success: true,
      message: `MFA requirement ${requireMfa ? 'enabled' : 'disabled'} for user`
    });
  } catch (error) {
    console.error("Error updating MFA requirement:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update MFA requirement"
    });
  }
});

/**
 * Reset MFA for a user (in case they lose access)
 * POST /api/admin/reset-mfa
 * Body: { userId: number }
 */
router.post("/reset-mfa", authenticateToken, authorizeRoles("admin", "superadmin", "it_support"), async (req: AuthRequest, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Disable MFA for the user
    await db
      .update(users)
      .set({
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null
      })
      .where(eq(users.id, userId));

    return res.status(200).json({
      success: true,
      message: "MFA has been reset for the user. They will need to set it up again."
    });
  } catch (error) {
    console.error("Error resetting MFA:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset MFA"
    });
  }
});

export default router;