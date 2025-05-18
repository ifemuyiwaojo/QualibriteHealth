/**
 * Multi-Factor Authentication (MFA) Library
 * 
 * This module provides MFA functionality for Qualibrite Health,
 * supporting authentication apps (TOTP) as the primary method.
 * 
 * It follows healthcare security best practices by providing an additional
 * layer of security for accessing sensitive patient data.
 */

import crypto from 'crypto';
import { totp } from 'otplib';
import { db } from '@db';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { Logger } from './logger';

// Constants for MFA implementation
const MFA_SECRET_LENGTH = 20; // Length of MFA secret in bytes
const MFA_ISSUER = 'Qualibrite Health';

/**
 * Generate a new MFA secret for a user
 * @param username Identifier for the user (typically email)
 * @returns Object containing the secret and provisioning URL for QR code
 */
export async function generateMfaSecret(username: string) {
  // Generate a secure random secret
  const secretBuffer = crypto.randomBytes(MFA_SECRET_LENGTH);
  const secret = secretBuffer.toString('base64');
  
  // Configure TOTP with our application settings
  totp.options = { 
    digits: 6,
    step: 30, // 30 second validity
    window: 1  // Allow 1 step before/after for time drift 
  };
  
  // Create provisioning URI for QR code generation
  const otpauth = totp.keyuri(username, MFA_ISSUER, secret);
  
  return {
    secret,
    otpauth
  };
}

/**
 * Verify an MFA token (OTP) against a user's secret
 * @param token The token provided by the user
 * @param secret The stored secret for the user
 * @returns Boolean indicating whether the token is valid
 */
export function verifyMfaToken(token: string, secret: string): boolean {
  try {
    // Configure TOTP with our application settings
    totp.options = { 
      digits: 6,
      step: 30,
      window: 1
    };
    
    // Verify the token
    return totp.verify({ token, secret });
  } catch (error) {
    // Log verification errors
    console.error('MFA token verification error:', error);
    return false;
  }
}

/**
 * Enable MFA for a user
 * @param userId The user's ID
 * @param secret The generated MFA secret
 * @returns Boolean indicating success
 */
export async function enableMfa(userId: number, secret: string): Promise<boolean> {
  try {
    // Update the user record with the MFA secret
    const [updatedUser] = await db.update(users)
      .set({ 
        mfaSecret: secret,
        mfaEnabled: true
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      return false;
    }
    
    // Log MFA enablement for audit trail
    await Logger.log('security', 'auth', 'MFA enabled for user', {
      userId,
      details: { timestamp: new Date().toISOString() }
    });
    
    return true;
  } catch (error) {
    console.error('Error enabling MFA:', error);
    return false;
  }
}

/**
 * Disable MFA for a user
 * @param userId The user's ID
 * @returns Boolean indicating success
 */
export async function disableMfa(userId: number): Promise<boolean> {
  try {
    // Update the user record to remove MFA settings
    const [updatedUser] = await db.update(users)
      .set({ 
        mfaSecret: null,
        mfaEnabled: false
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      return false;
    }
    
    // Log MFA disablement for audit trail
    await Logger.log('security', 'auth', 'MFA disabled for user', {
      userId,
      details: { timestamp: new Date().toISOString() }
    });
    
    return true;
  } catch (error) {
    console.error('Error disabling MFA:', error);
    return false;
  }
}

/**
 * Check if MFA is required for a user
 * @param userId The user's ID
 * @returns Boolean indicating whether MFA is required
 */
export async function isMfaRequired(userId: number): Promise<boolean> {
  try {
    // Get the user record
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!user) {
      return false;
    }
    
    // Determine if MFA is required based on user properties
    // For example, we could require it for all admin/provider users
    return user.mfaEnabled || ['admin', 'provider'].includes(user.role);
  } catch (error) {
    console.error('Error checking MFA requirement:', error);
    return false;
  }
}