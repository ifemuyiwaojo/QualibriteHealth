/**
 * Admin Temporary Password Routes
 * These routes enable admins to generate temporary passwords for patient accounts
 * Part of Phase 3 security improvements for Qualibrite Health
 */

import express from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/auth";
import { generateSecurePassword } from "../lib/password-utils";
import { hashPassword } from "../lib/auth-utils";
import { logSecurityAudit, SecurityEventType } from "../lib/security-audit-logger";
import { sendEmail } from "../lib/email";

const router = express.Router();

/**
 * Route to get a list of patients for password reset
 * GET /api/admin/temp-password/patients
 * Returns a list of patient accounts (id, email, username)
 */
router.get("/temp-password/patients", authenticateToken, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    // Get list of patients for dropdown selection
    // Get all patients with a simpler query
    const patientUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, "patient"));
      
    // Process the results for the frontend
    const processedPatients = patientUsers.map(patient => ({
      id: patient.id,
      email: patient.email,
      username: patient.username || '',
      firstName: patient.metadata?.firstName || '',
      lastName: patient.metadata?.lastName || '',
      changePasswordRequired: patient.changePasswordRequired
    }));

    return res.status(200).json(processedPatients);
  } catch (error) {
    console.error("Error getting patient list:", error);
    return res.status(500).json({ message: "Failed to retrieve patient list" });
  }
});

/**
 * Generate a temporary password for a patient account
 * POST /api/admin/temp-password/generate
 * Body: { userId: number }
 * Returns: { success: boolean, tempPassword?: string }
 */
router.post("/temp-password/generate", authenticateToken, authorizeRoles("admin", "superadmin"), async (req: AuthRequest, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId || typeof userId !== "number") {
      return res.status(400).json({ message: "Valid user ID is required" });
    }

    // Verify user exists and is a patient
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "patient") {
      return res.status(400).json({ 
        message: "Temporary password generation is only available for patient accounts" 
      });
    }

    // Generate a secure but readable temporary password
    const tempPassword = generateSecurePassword({ 
      length: 12, 
      uppercase: true, 
      lowercase: true, 
      numbers: true, 
      specialChars: true 
    });

    // Hash the password before storing
    const hashedPassword = await hashPassword(tempPassword);

    // Update the user's password and set changePasswordRequired flag
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        changePasswordRequired: true,
        lastPasswordChange: new Date()
      })
      .where(eq(users.id, userId));

    // Log the security event
    await logSecurityAudit(
      SecurityEventType.PASSWORD_RESET,
      "Admin generated temporary password",
      {
        userId: req.session?.userId,
        targetUserId: userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        outcome: "SUCCESS",
        details: {
          action: "TEMP_PASSWORD_GENERATION",
          targetUserRole: user.role,
          targetUserEmail: user.email,
          passwordChangeRequired: true
        }
      }
    );

    // Optional: Send email notification to user (in production)
    // Note: This would need proper email configuration in production
    try {
      await sendEmail({
        to: user.email,
        subject: "Your Temporary Password for Qualibrite Health",
        text: `A temporary password has been generated for your Qualibrite Health account. 
          Temporary Password: ${tempPassword}
          Please log in and change your password immediately.
          This temporary password will expire after your first login.`
      });
    } catch (emailError) {
      console.warn("Could not send password email notification:", emailError);
      // Continue - email failure shouldn't prevent password reset
    }

    return res.status(200).json({ 
      success: true, 
      tempPassword,
      message: "Temporary password generated successfully"
    });
  } catch (error) {
    console.error("Error generating temporary password:", error);
    
    // Log the security event - failure
    await logSecurityAudit(
      SecurityEventType.PASSWORD_RESET,
      "Admin temporary password generation failed",
      {
        userId: req.session?.userId,
        targetUserId: req.body?.userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        outcome: "FAILURE",
        details: {
          action: "TEMP_PASSWORD_GENERATION",
          error: error.message
        }
      }
    );
    
    return res.status(500).json({ 
      success: false,
      message: "Failed to generate temporary password"
    });
  }
});

export default router;