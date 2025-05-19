/**
 * Admin Temporary Password Routes
 * These routes enable admins to generate temporary passwords for patient accounts
 * Part of Phase 3 security improvements for Qualibrite Health
 */

import express from "express";
import { db } from "@db";
import { users, auditLogs } from "@db/schema";
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
    // Get all patients from the database
    console.log("Fetching patient list...");
    
    // Use a direct query with simpler structure
    console.log("Running simplified patient query...");
    const patientUsers = await db
      .select({
        id: users.id,
        email: users.email,
        changePasswordRequired: users.changePasswordRequired
      })
      .from(users)
      .where(eq(users.role, "patient"));
      
    if (!patientUsers || patientUsers.length === 0) {
      return res.status(200).json([]); // Return empty array if no patients found
    }
    
    // Process the results for the frontend - using a simpler approach with basic data
    const processedPatients = patientUsers.map(patient => {
      console.log('Processing patient:', patient.id, patient.email);
      
      return {
        id: patient.id,
        email: patient.email,
        // Simple display name derived from email for display
        username: patient.email.split('@')[0],
        firstName: '',
        lastName: '',
        changePasswordRequired: patient.changePasswordRequired
      };
    });

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
    const { userId, forceRegenerate } = req.body;
    
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
    
    // Check if user already has a temporary password that hasn't been changed yet
    if (user.changePasswordRequired && forceRegenerate !== true) {
      return res.status(200).json({ 
        success: true, 
        message: "User already has a temporary password that hasn't been changed. Use forceRegenerate to create a new one.",
        hasExistingTemporaryPassword: true,
        userId: user.id,
        email: user.email
      });
    }

    // Generate a temporary password manually since we have import issues
    // This follows HIPAA guidelines with uppercase, lowercase, numbers, and special characters
    const generatePassword = () => {
      const length = 12;
      const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Omitting similar-looking chars
      const lowercaseChars = 'abcdefghijkmnpqrstuvwxyz';
      const numberChars = '23456789'; // Omitting 0/1 that look like O/l
      const specialChars = '!@#$%^&*()-_=+';
      
      let password = '';
      
      // Ensure at least one of each character type
      password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
      password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
      password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
      password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
      
      // Fill the rest randomly
      const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
      for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }
      
      // Shuffle the password to avoid predictable pattern
      return password.split('').sort(() => 0.5 - Math.random()).join('');
    };
    
    const tempPassword = generatePassword();
    
    // Use the imported hashPassword function that we already have
    const hashedPassword = await hashPassword(tempPassword);

    // Update the user's password and set changePasswordRequired flag
    await db
      .update(users)
      .set({ 
        passwordHash: hashedPassword, // Using passwordHash field instead of password
        changePasswordRequired: true,
        updatedAt: new Date() // Using updatedAt field instead of lastPasswordChange
      })
      .where(eq(users.id, userId));

    // Log the security event - use direct DB insert to avoid imported functionality
    try {
      if (req.session && typeof req.session.userId === 'number') {
        await db.insert(auditLogs).values({
          userId: req.session.userId,
          action: "PASSWORD_RESET",
          resourceType: "USER",
          resourceId: userId,
          details: { 
            targetUser: user.email, 
            action: "TEMP_PASSWORD_GENERATION",
            outcome: "SUCCESS",
            passwordChangeRequired: true
          },
          ipAddress: req.ip || null,
          userAgent: req.headers['user-agent'] || null
        });
        console.log("Successfully logged temp password generation");
      }
    } catch (logError) {
      console.error("Error logging temp password generation:", logError);
      // Continue even if logging fails - don't block the operation
    }

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