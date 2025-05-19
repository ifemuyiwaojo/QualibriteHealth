/**
 * Mobile Authentication Service
 * 
 * This module provides functionality for managing mobile authentication
 * as part of Phase 2 security improvements for Qualibrite Health.
 */

import { db } from '@db';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { Logger } from './logger';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { SecretManager } from './secret-manager';

// Configuration
const DEVICE_VERIFICATION_EXPIRY = 10 * 60 * 1000; // 10 minutes
const MOBILE_SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

// Interface for device information
interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceModel?: string;
  platform: 'ios' | 'android' | 'other';
  osVersion?: string;
  appVersion?: string;
}

// Interface for mobile user metadata
interface MobileUserMetadata {
  trustedDevices?: {
    [deviceId: string]: {
      deviceName: string;
      deviceModel?: string;
      platform: string;
      osVersion?: string;
      lastUsed: string;
      dateAdded: string;
    }
  };
  deviceVerificationCodes?: {
    [code: string]: {
      deviceId: string;
      expiresAt: string;
    }
  };
}

/**
 * Generate a verification code for a new device
 * 
 * @param userId User ID requesting device verification
 * @param deviceInfo Information about the device
 * @returns The verification code
 */
export async function generateDeviceVerificationCode(
  userId: number,
  deviceInfo: DeviceInfo
): Promise<string> {
  try {
    // Get user data
    const [userData] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Parse metadata or initialize if not exists
    const metadata = userData.metadata as MobileUserMetadata || {};
    
    // Initialize deviceVerificationCodes if not exists
    if (!metadata.deviceVerificationCodes) {
      metadata.deviceVerificationCodes = {};
    }
    
    // Generate a 6-digit verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    
    // Set expiration time
    const expiresAt = new Date(Date.now() + DEVICE_VERIFICATION_EXPIRY);
    
    // Store the verification code
    metadata.deviceVerificationCodes[verificationCode] = {
      deviceId: deviceInfo.deviceId,
      expiresAt: expiresAt.toISOString()
    };
    
    // Update user metadata
    await db.update(users)
      .set({
        metadata: metadata as any
      })
      .where(eq(users.id, userId));
    
    // Log the action
    await Logger.logSecurity("Mobile device verification code generated", {
      userId,
      details: { 
        deviceId: deviceInfo.deviceId,
        platform: deviceInfo.platform,
        expiresAt
      }
    });
    
    return verificationCode;
  } catch (error) {
    console.error("Error generating device verification code:", error);
    throw new Error("Failed to generate device verification code");
  }
}

/**
 * Verify a device verification code
 * 
 * @param userId User ID
 * @param verificationCode Code to verify
 * @param deviceInfo Device information
 * @returns True if verification was successful
 */
export async function verifyDeviceCode(
  userId: number,
  verificationCode: string,
  deviceInfo: DeviceInfo
): Promise<boolean> {
  try {
    // Get user data
    const [userData] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Parse metadata
    const metadata = userData.metadata as MobileUserMetadata || {};
    
    // Check if verification code exists
    if (!metadata.deviceVerificationCodes || 
        !metadata.deviceVerificationCodes[verificationCode]) {
      return false;
    }
    
    const verification = metadata.deviceVerificationCodes[verificationCode];
    
    // Check if code has expired
    const expiresAt = new Date(verification.expiresAt);
    if (expiresAt < new Date()) {
      // Delete expired code
      delete metadata.deviceVerificationCodes[verificationCode];
      
      // Update user metadata
      await db.update(users)
        .set({
          metadata: metadata as any
        })
        .where(eq(users.id, userId));
      
      return false;
    }
    
    // Check if device ID matches
    if (verification.deviceId !== deviceInfo.deviceId) {
      return false;
    }
    
    // Initialize trustedDevices if not exists
    if (!metadata.trustedDevices) {
      metadata.trustedDevices = {};
    }
    
    // Add device to trusted devices
    metadata.trustedDevices[deviceInfo.deviceId] = {
      deviceName: deviceInfo.deviceName,
      deviceModel: deviceInfo.deviceModel,
      platform: deviceInfo.platform,
      osVersion: deviceInfo.osVersion,
      lastUsed: new Date().toISOString(),
      dateAdded: new Date().toISOString()
    };
    
    // Remove the used verification code
    delete metadata.deviceVerificationCodes[verificationCode];
    
    // Update user metadata
    await db.update(users)
      .set({
        metadata: metadata as any
      })
      .where(eq(users.id, userId));
    
    // Log the action
    await Logger.logSecurity("Mobile device verified and trusted", {
      userId,
      details: { 
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        platform: deviceInfo.platform
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error verifying device code:", error);
    return false;
  }
}

/**
 * Check if a device is trusted for a user
 * 
 * @param userId User ID
 * @param deviceId Device ID to check
 * @returns True if device is trusted
 */
export async function isDeviceTrusted(
  userId: number,
  deviceId: string
): Promise<boolean> {
  try {
    // Get user data
    const [userData] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      return false;
    }
    
    // Parse metadata
    const metadata = userData.metadata as MobileUserMetadata || {};
    
    // Check if device is trusted
    return !!(metadata.trustedDevices && metadata.trustedDevices[deviceId]);
  } catch (error) {
    console.error("Error checking trusted device:", error);
    return false;
  }
}

/**
 * Remove a device from trusted devices
 * 
 * @param userId User ID
 * @param deviceId Device ID to remove
 * @returns True if device was removed
 */
export async function removeTrustedDevice(
  userId: number,
  deviceId: string
): Promise<boolean> {
  try {
    // Get user data
    const [userData] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      return false;
    }
    
    // Parse metadata
    const metadata = userData.metadata as MobileUserMetadata || {};
    
    // Check if device exists
    if (!metadata.trustedDevices || !metadata.trustedDevices[deviceId]) {
      return false;
    }
    
    // Remove device
    delete metadata.trustedDevices[deviceId];
    
    // Update user metadata
    await db.update(users)
      .set({
        metadata: metadata as any
      })
      .where(eq(users.id, userId));
    
    // Log the action
    await Logger.logSecurity("Trusted mobile device removed", {
      userId,
      details: { deviceId }
    });
    
    return true;
  } catch (error) {
    console.error("Error removing trusted device:", error);
    return false;
  }
}

/**
 * Generate a mobile authentication token with longer expiry
 * 
 * @param userId User ID
 * @param deviceInfo Device information
 * @returns JWT token for mobile authentication
 */
export async function generateMobileAuthToken(
  userId: number,
  deviceInfo: DeviceInfo
): Promise<string> {
  try {
    // Check if device is trusted
    const trusted = await isDeviceTrusted(userId, deviceInfo.deviceId);
    
    if (!trusted) {
      throw new Error("Device not trusted");
    }
    
    // Get user data to include in token
    const [userData] = await db.select({
      id: users.id,
      email: users.email,
      role: users.role
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Generate token with extended expiry for mobile
    const token = jwt.sign(
      { 
        id: userData.id,
        email: userData.email,
        role: userData.role,
        deviceId: deviceInfo.deviceId,
        tokenType: 'mobile' 
      },
      SecretManager.getJwtSecret(),
      { expiresIn: MOBILE_SESSION_DURATION }
    );
    
    // Update device last used time
    const [metadataRecord] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (metadataRecord) {
      const metadata = metadataRecord.metadata as MobileUserMetadata || {};
      
      if (metadata.trustedDevices && metadata.trustedDevices[deviceInfo.deviceId]) {
        metadata.trustedDevices[deviceInfo.deviceId].lastUsed = new Date().toISOString();
        
        await db.update(users)
          .set({
            metadata: metadata as any
          })
          .where(eq(users.id, userId));
      }
    }
    
    // Log the action
    await Logger.logSecurity("Mobile authentication token generated", {
      userId,
      details: { 
        deviceId: deviceInfo.deviceId,
        platform: deviceInfo.platform
      }
    });
    
    return token;
  } catch (error) {
    console.error("Error generating mobile auth token:", error);
    throw new Error("Failed to generate mobile authentication token");
  }
}

/**
 * List all trusted devices for a user
 * 
 * @param userId User ID
 * @returns Array of trusted devices
 */
export async function listTrustedDevices(userId: number): Promise<Array<{
  deviceId: string;
  deviceName: string;
  deviceModel?: string;
  platform: string;
  osVersion?: string;
  lastUsed: Date;
  dateAdded: Date;
}>> {
  try {
    // Get user data
    const [userData] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      return [];
    }
    
    // Parse metadata
    const metadata = userData.metadata as MobileUserMetadata || {};
    
    if (!metadata.trustedDevices) {
      return [];
    }
    
    // Convert to array format
    return Object.entries(metadata.trustedDevices).map(([deviceId, device]) => ({
      deviceId,
      deviceName: device.deviceName,
      deviceModel: device.deviceModel,
      platform: device.platform,
      osVersion: device.osVersion,
      lastUsed: new Date(device.lastUsed),
      dateAdded: new Date(device.dateAdded)
    }));
  } catch (error) {
    console.error("Error listing trusted devices:", error);
    return [];
  }
}