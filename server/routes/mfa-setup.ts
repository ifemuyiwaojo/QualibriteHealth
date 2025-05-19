import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler } from "../lib/error-handler";
import { AppError } from "../lib/error-handler";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Logger } from "../lib/logger";
import { generateSecret, generateTOTP, verifyTOTP } from "otplib";
import { randomBytes } from "crypto";

const router = Router();

// Get current MFA status
router.get("/status", authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  
  // Get user with MFA status
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      mfaEnabled: true,
      metadata: true,
    }
  });
  
  if (!user) {
    throw new AppError("User not found", 404);
  }
  
  // Check if MFA is required from metadata
  const isMfaRequired = user.metadata && 
    typeof user.metadata === 'object' && 
    (user.metadata as any).mfaRequired === true;
  
  // Return MFA status information
  res.json({
    mfaEnabled: !!user.mfaEnabled,
    mfaRequired: isMfaRequired,
    setupComplete: !!user.mfaEnabled,
    needsSetup: isMfaRequired && !user.mfaEnabled,
  });
}));

// Generate new MFA setup
router.post("/generate", authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  
  // Get user for setup
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) {
    throw new AppError("User not found", 404);
  }
  
  // Generate a new MFA secret
  const secret = generateSecret();
  
  // Create a QR code URL for the authenticator app
  const serviceName = "QualiBrite Health";
  const otpauth = `otpauth://totp/${encodeURIComponent(serviceName)}:${encodeURIComponent(user.email)}?secret=${secret}&issuer=${encodeURIComponent(serviceName)}`;
  
  // Save the secret temporarily in a session for verification
  if (req.session) {
    req.session.tempMfaSecret = secret;
  }
  
  // Log the MFA setup initiation
  await Logger.logSecurity("MFA setup initiated", {
    userId: user.id,
    ipAddress: req.ip,
  });
  
  // Return setup information
  res.json({
    secret,
    qrCodeUrl: otpauth,
    email: user.email,
  });
}));

// Verify and enable MFA
router.post("/verify", authenticateToken, asyncHandler(async (req: any, res) => {
  const { token } = req.body;
  const userId = req.user.id;
  
  if (!token) {
    throw new AppError("Verification token is required", 400);
  }
  
  // Get the temporary secret from session
  if (!req.session || !req.session.tempMfaSecret) {
    throw new AppError("No active MFA setup session", 400);
  }
  
  const secret = req.session.tempMfaSecret;
  
  // Verify the token
  let isValid = false;
  try {
    isValid = verifyTOTP(token, secret);
  } catch (error) {
    throw new AppError("Invalid verification token", 400);
  }
  
  if (!isValid) {
    throw new AppError("Invalid verification token", 400);
  }
  
  // Generate backup codes (10 random codes)
  const backupCodes: Record<string, boolean> = {};
  for (let i = 0; i < 10; i++) {
    const code = randomBytes(4).toString('hex');
    backupCodes[code] = true;
  }
  
  // Enable MFA for the user
  await db.update(users)
    .set({ 
      mfaEnabled: true,
      mfaSecret: secret,
      mfaBackupCodes: backupCodes,
      // Also update the metadata to show MFA is required AND enabled
      metadata: db.fn.json({ 
        ...((typeof user.metadata === 'object' ? user.metadata : {}) as any), 
        mfaRequired: true 
      })
    })
    .where(eq(users.id, userId));
  
  // Clear the temporary secret
  if (req.session) {
    delete req.session.tempMfaSecret;
  }
  
  // Log the successful MFA setup
  await Logger.logSecurity("MFA setup completed successfully", {
    userId,
    ipAddress: req.ip,
  });
  
  // Return the backup codes to the user
  res.json({
    success: true,
    message: "MFA has been successfully enabled",
    backupCodes: Object.keys(backupCodes),
  });
}));

// Disable MFA (if allowed)
router.post("/disable", authenticateToken, asyncHandler(async (req: any, res) => {
  const userId = req.user.id;
  
  // Get user with MFA status and metadata
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      mfaEnabled: true,
      metadata: true,
    }
  });
  
  if (!user) {
    throw new AppError("User not found", 404);
  }
  
  // Check if MFA is required from metadata
  const isMfaRequired = user.metadata && 
    typeof user.metadata === 'object' && 
    (user.metadata as any).mfaRequired === true;
  
  // Cannot disable MFA if it's required
  if (isMfaRequired) {
    throw new AppError("MFA is required for your account and cannot be disabled", 403);
  }
  
  // Disable MFA
  await db.update(users)
    .set({ 
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: null,
    })
    .where(eq(users.id, userId));
  
  // Log the MFA disablement
  await Logger.logSecurity("MFA disabled", {
    userId,
    ipAddress: req.ip,
  });
  
  res.json({
    success: true,
    message: "MFA has been successfully disabled",
  });
}));

export default router;