import { Router } from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateSecurePassword } from "../lib/password-utils";
import { hashPassword } from "../lib/auth-utils";
import { isAdmin } from "../middleware/role-check";
import { isAuthenticated } from "../middleware/auth";
import { logSecurityAudit, SecurityEventType, SecurityEventSeverity } from "../lib/security-audit-logger";

const router = Router();

// Schema for temporary password generation request
const tempPasswordSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  passwordOptions: z.object({
    length: z.number().int().min(8).max(24),
    includeUppercase: z.boolean(),
    includeLowercase: z.boolean(),
    includeNumbers: z.boolean(),
    includeSpecialChars: z.boolean(),
    requireChange: z.boolean(),
  }),
});

/**
 * Route to generate a temporary password for a patient user
 * POST /api/admin/generate-temp-password
 * Restricted to admin users only
 */
router.post("/generate-temp-password", isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Validate request body
    const validatedData = tempPasswordSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: validatedData.error.format() 
      });
    }

    const { userId, email, passwordOptions } = validatedData.data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user's email matches the provided email
    if (existingUser.email !== email) {
      return res.status(400).json({ message: "User ID and email do not match" });
    }

    // Generate secure temporary password based on options
    const temporaryPassword = generateSecurePassword({
      length: passwordOptions.length,
      uppercase: passwordOptions.includeUppercase,
      lowercase: passwordOptions.includeLowercase,
      numbers: passwordOptions.includeNumbers,
      specialChars: passwordOptions.includeSpecialChars,
    });

    // Hash the temporary password
    const hashedPassword = await hashPassword(temporaryPassword);

    // Update user's password and set requiresPasswordChange flag if needed
    await db
      .update(users)
      .set({ 
        password: hashedPassword, 
        requiresPasswordChange: passwordOptions.requireChange,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    // Log the security event
    await logSecurityAudit(
      SecurityEventType.PASSWORD_RESET,
      "Administrator generated temporary password for user",
      {
        userId: req.session.userId,
        targetUserId: userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        sessionId: req.sessionID,
        outcome: "SUCCESS",
        details: {
          targetUserEmail: email,
          requiresPasswordChange: passwordOptions.requireChange
        }
      }
    );

    // Return success response with the generated password
    return res.status(200).json({
      message: "Temporary password generated successfully",
      temporaryPassword,
      requiresPasswordChange: passwordOptions.requireChange
    });
  } catch (error) {
    console.error("Error generating temporary password:", error);
    return res.status(500).json({ message: "Failed to generate temporary password" });
  }
});

export default router;