/**
 * Mobile Authentication Routes
 * Part of Phase 2 security improvements for Qualibrite Health
 */

import { Router } from "express";
import { z } from "zod";
import { asyncHandler, AppError } from "../lib/error-handler";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { 
  generateDeviceVerificationCode, 
  verifyDeviceCode, 
  isDeviceTrusted,
  removeTrustedDevice,
  generateMobileAuthToken,
  listTrustedDevices
} from "../lib/mobile-auth";
import { fromZodError } from "zod-validation-error";
import { Logger } from "../lib/logger";

const router = Router();

// Schema for device info validation
const deviceInfoSchema = z.object({
  deviceId: z.string().min(10, "Device ID is required"),
  deviceName: z.string().min(1, "Device name is required"),
  deviceModel: z.string().optional(),
  platform: z.enum(["ios", "android", "other"], {
    errorMap: () => ({ message: "Platform must be 'ios', 'android', or 'other'" })
  }),
  osVersion: z.string().optional(),
  appVersion: z.string().optional()
});

// Schema for device verification request
const verificationRequestSchema = z.object({
  deviceInfo: deviceInfoSchema
});

// Schema for device verification code validation
const verifyCodeSchema = z.object({
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
  deviceInfo: deviceInfoSchema
});

/**
 * Generate a verification code for mobile device
 * POST /api/mobile/request-verification
 */
router.post('/request-verification', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  // Validate request body
  const result = verificationRequestSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(fromZodError(result.error).message, 400);
  }
  
  const { deviceInfo } = result.data;
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  
  // Generate verification code
  const verificationCode = await generateDeviceVerificationCode(userId, deviceInfo);
  
  // In a real environment, this would be sent to the user via SMS or email
  // For development purposes, we're returning it directly
  res.status(200).json({ 
    message: "Verification code generated",
    verificationCode,
    // In production, remove the line above and use this instead:
    // message: "Verification code sent to your registered phone number/email"
  });
}));

/**
 * Verify a mobile device with verification code
 * POST /api/mobile/verify-device
 */
router.post('/verify-device', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  // Validate request body
  const result = verifyCodeSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(fromZodError(result.error).message, 400);
  }
  
  const { verificationCode, deviceInfo } = result.data;
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  
  // Verify the code
  const verified = await verifyDeviceCode(userId, verificationCode, deviceInfo);
  
  if (!verified) {
    throw new AppError("Invalid or expired verification code", 400);
  }
  
  // Generate mobile auth token with extended expiry
  const token = await generateMobileAuthToken(userId, deviceInfo);
  
  res.status(200).json({ 
    message: "Device verified successfully",
    token,
    tokenType: "mobile"
  });
}));

/**
 * Get list of trusted devices for the user
 * GET /api/mobile/trusted-devices
 */
router.get('/trusted-devices', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  
  const devices = await listTrustedDevices(userId);
  
  res.status(200).json({ 
    trustedDevices: devices
  });
}));

/**
 * Remove a trusted device
 * DELETE /api/mobile/trusted-devices/:deviceId
 */
router.delete('/trusted-devices/:deviceId', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { deviceId } = req.params;
  
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  
  if (!deviceId) {
    throw new AppError("Device ID is required", 400);
  }
  
  const removed = await removeTrustedDevice(userId, deviceId);
  
  if (!removed) {
    throw new AppError("Device not found or already removed", 404);
  }
  
  await Logger.logSecurity("User removed trusted device", {
    userId,
    details: { deviceId }
  });
  
  res.status(200).json({ 
    message: "Device removed successfully" 
  });
}));

/**
 * Check if current device is trusted
 * POST /api/mobile/check-device
 */
router.post('/check-device', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  // Validate request body
  const result = deviceInfoSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(fromZodError(result.error).message, 400);
  }
  
  const deviceInfo = result.data;
  const userId = req.user?.id;
  
  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }
  
  // Check if device is trusted
  const trusted = await isDeviceTrusted(userId, deviceInfo.deviceId);
  
  res.status(200).json({ 
    deviceId: deviceInfo.deviceId,
    trusted
  });
}));

export default router;