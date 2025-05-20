/**
 * Admin Account Unlock Routes
 * These routes enable admins, superadmins, and IT specialists to unlock locked accounts
 * Part of Phase 4 security improvements for Qualibrite Health
 */

import express from "express";
import { db } from "@db";
import { users, auditLogs } from "@db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/auth";
import { logSecurityAudit, SecurityEventType } from "../lib/security-audit-logger";

const router = express.Router();

/**
 * Get a list of locked accounts
 * GET /api/admin/accounts/locked
 * Returns a list of locked accounts with relevant information
 */
router.get("/accounts/locked", authenticateToken, authorizeRoles("admin", "superadmin", "it_support"), async (req, res) => {
  try {
    const lockedAccounts = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        lastFailedLogin: users.lastFailedLogin,
        failedLoginAttempts: users.failedLoginAttempts,
        lockExpiresAt: users.lockExpiresAt,
        isSuperadmin: users.isSuperadmin
      })
      .from(users)
      .where(eq(users.accountLocked, true));
    
    return res.status(200).json(lockedAccounts);
  } catch (error) {
    console.error("Error fetching locked accounts:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to retrieve locked accounts" 
    });
  }
});

/**
 * Unlock a user account
 * POST /api/admin/accounts/unlock
 * Body: { userId: number }
 * Returns: { success: boolean, message: string }
 */
router.post("/accounts/unlock", authenticateToken, authorizeRoles("admin", "superadmin", "it_support"), async (req: AuthRequest, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId || typeof userId !== "number") {
      return res.status(400).json({ 
        success: false,
        message: "Valid user ID is required" 
      });
    }
    
    // Get user details before unlocking
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    // Check if the account is really locked
    if (!user.accountLocked) {
      return res.status(400).json({ 
        success: false,
        message: "Account is not locked" 
      });
    }
    
    // Permission handling based on role hierarchies
    if (user.role === "admin" && req.user?.role !== "superadmin") {
      return res.status(403).json({ 
        success: false,
        message: "Only superadmins can unlock admin accounts" 
      });
    }
    
    // Special handling for superadmin accounts - need special procedure
    if (user.isSuperadmin) {
      return res.status(403).json({ 
        success: false,
        message: "Superadmin accounts require a special unlock procedure. Please contact system support." 
      });
    }
    
    // Unlock the account
    await db.update(users)
      .set({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        accountLocked: false,
        lockExpiresAt: null
      })
      .where(eq(users.id, userId));
    
    // Log security event
    try {
      if (req.session?.userId) {
        await db.insert(auditLogs).values({
          userId: req.session.userId,
          action: "ACCOUNT_UNLOCKED",
          resourceType: "USER",
          resourceId: userId,
          details: {
            targetUser: user.email,
            targetRole: user.role,
            action: "MANUAL_ACCOUNT_UNLOCK",
            unlockReason: "Administrator action",
            adminRole: req.user?.role
          },
          ipAddress: req.ip || null,
          userAgent: req.headers['user-agent'] || null
        });
      }
    } catch (logError) {
      console.error("Error logging account unlock:", logError);
      // Continue even if logging fails
    }
    
    return res.status(200).json({ 
      success: true,
      message: `Account for ${user.email} has been successfully unlocked` 
    });
  } catch (error) {
    console.error("Error unlocking account:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to unlock account" 
    });
  }
});

export default router;