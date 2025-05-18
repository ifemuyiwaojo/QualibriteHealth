/**
 * Multi-Factor Authentication (MFA) Routes
 * 
 * This module provides API endpoints for setting up and managing MFA,
 * part of Phase 2 security improvements for Qualibrite Health.
 */

import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { asyncHandler, AppError } from "../lib/error-handler";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { generateMfaSecret, verifyMfaToken, enableMfa, disableMfa } from "../lib/mfa";
import { Logger } from "../lib/logger";
import QRCode from "qrcode";
import session from "express-session";

// We use the session declaration from middleware/auth.ts
// Just adding the MFA-specific properties here for documentation
// (No actual declaration needed as it would conflict with auth.ts)

// QRCode module is now properly typed with @types/qrcode

const router = Router();

// Setup MFA (requires authentication)
router.post("/setup", authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
  }
  
  // Get the user from the database to ensure we have the latest data
  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.id),
  });
  
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  
  // Check if MFA is already enabled
  if (user.mfaEnabled) {
    throw new AppError("MFA is already enabled for this account", 400, "MFA_ALREADY_ENABLED");
  }
  
  // Generate a new MFA secret
  const { secret, otpauth } = await generateMfaSecret(user.email);
  
  // Temporarily store the secret in the session (not activated yet)
  if (req.session) {
    req.session.mfaSecret = secret;
    req.session.mfaSetupStarted = true;
  }
  
  // Generate QR code with improved settings for better scanning
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth, {
    errorCorrectionLevel: 'H',  // High error correction for better scanning
    margin: 2,                  // Proper margin
    scale: 8,                   // Larger size for better scanning
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  
  // Log MFA setup start for audit trail
  await Logger.log("security", "auth", "MFA setup initiated", {
    userId: req.user.id,
    request: req
  });
  
  // Return the QR code and other setup information
  res.json({
    message: "MFA setup initiated",
    qrCode: qrCodeDataUrl,
    secret, // In production, consider if showing the secret is necessary
    otpauthUrl: otpauth
  });
}));

// Verify and activate MFA
router.post("/verify", authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
  }
  
  const { token } = req.body;
  
  if (!token) {
    throw new AppError("Verification token is required", 400, "MISSING_TOKEN");
  }
  
  // Get the secret from the session
  if (!req.session?.mfaSecret || !req.session?.mfaSetupStarted) {
    throw new AppError("MFA setup not initiated", 400, "SETUP_REQUIRED");
  }
  
  const mfaSecret = req.session.mfaSecret;
  
  // For testing purposes, accept "123456" as a valid test code
  let isValid = false;
  
  // Accept test code in non-production environments
  if (process.env.NODE_ENV !== 'production' && token === '123456') {
    console.log('Using test verification code in MFA setup');
    isValid = true;
  } else {
    // Verify the token against the secret using standard TOTP verification
    isValid = verifyMfaToken(token, mfaSecret);
  }
  
  if (!isValid) {
    // Log failed verification attempt
    await Logger.log("security", "auth", "MFA verification failed", {
      userId: req.user.id,
      request: req
    });
    
    throw new AppError("Invalid verification token", 400, "INVALID_TOKEN");
  }
  
  // Token is valid, activate MFA for the user
  const success = await enableMfa(req.user.id, mfaSecret);
  
  if (!success) {
    throw new AppError("Failed to enable MFA", 500, "ENABLE_FAILED");
  }
  
  // Clear the secret from the session now that it's stored in the database
  if (req.session) {
    delete req.session.mfaSecret;
    delete req.session.mfaSetupStarted;
  }
  
  // Log successful MFA activation
  await Logger.log("security", "auth", "MFA activated successfully", {
    userId: req.user.id,
    request: req
  });
  
  res.json({
    message: "MFA enabled successfully",
    mfaEnabled: true
  });
}));

// Disable MFA (requires authentication)
router.post("/disable", authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
  }
  
  const { token } = req.body;
  
  if (!token) {
    throw new AppError("Verification token is required", 400, "MISSING_TOKEN");
  }
  
  // Get the user with their MFA secret
  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.id),
  });
  
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  
  if (!user.mfaEnabled || !user.mfaSecret) {
    throw new AppError("MFA is not enabled for this account", 400, "MFA_NOT_ENABLED");
  }
  
  // Verify the token against the user's secret
  const isValid = verifyMfaToken(token, user.mfaSecret);
  
  if (!isValid) {
    // Log failed verification attempt
    await Logger.log("security", "auth", "MFA disable verification failed", {
      userId: req.user.id,
      request: req
    });
    
    throw new AppError("Invalid verification token", 400, "INVALID_TOKEN");
  }
  
  // Token is valid, disable MFA for the user
  const success = await disableMfa(req.user.id);
  
  if (!success) {
    throw new AppError("Failed to disable MFA", 500, "DISABLE_FAILED");
  }
  
  // Log successful MFA deactivation
  await Logger.log("security", "auth", "MFA disabled successfully", {
    userId: req.user.id,
    request: req
  });
  
  res.json({
    message: "MFA disabled successfully",
    mfaEnabled: false
  });
}));

// Validate an MFA token (used during login with MFA)
router.post("/validate", asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  
  if (!userId || !token) {
    throw new AppError("User ID and token are required", 400, "MISSING_FIELDS");
  }
  
  // Get the user with their MFA secret
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  
  if (!user.mfaEnabled || !user.mfaSecret) {
    throw new AppError("MFA is not enabled for this account", 400, "MFA_NOT_ENABLED");
  }
  
  // Verify the token against the user's secret
  const isValid = verifyMfaToken(token, user.mfaSecret);
  
  if (!isValid) {
    // Log failed verification attempt
    await Logger.log("security", "auth", "MFA login verification failed", {
      userId: user.id,
      request: req
    });
    
    throw new AppError("Invalid verification token", 400, "INVALID_TOKEN");
  }
  
  // Token is valid
  // Log successful MFA validation
  await Logger.log("security", "auth", "MFA login verification successful", {
    userId: user.id,
    request: req
  });
  
  res.json({
    message: "MFA token validated successfully",
    valid: true
  });
}));

export default router;