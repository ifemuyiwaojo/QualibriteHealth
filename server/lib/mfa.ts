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
import { authenticator } from 'otplib'; // Use authenticator specifically for Google Authenticator compatibility
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
  // Generate a secret compatible with Google Authenticator
  // Using base32 encoding which is compatible with Google Authenticator
  
  // Generate a secret using the authenticator library's built-in method
  // This ensures proper formatting compatible with Google Authenticator
  const secret = authenticator.generateSecret();
  
  // Configure authenticator with standard settings
  authenticator.options = { 
    digits: 6,
    step: 30, // 30 second validity
    window: 2  // Allow more window for time drift
  };
  
  // Create provisioning URI for QR code generation
  const otpauth = authenticator.keyuri(username, MFA_ISSUER, secret);
  
  // Log information about the generated secret for debugging
  console.log('Generated new MFA secret:', {
    username,
    secretLength: secret.length,
    secretStart: secret.substring(0, 5) + '...',
    timestamp: new Date().toISOString()
  });
  
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
    // Configure authenticator with standard settings used by Google Authenticator
    authenticator.options = { 
      digits: 6,
      step: 30,
      window: 2  // Allow larger window for time drift
    };
    
    // Debug information for verification
    console.log('Verifying token:', {
      tokenLength: token.length,
      secretLength: secret.length,
      secretStart: secret.substring(0, 5) + '...',
      timestamp: new Date().toISOString()
    });
    
    // For testing purposes, add a backdoor for development/testing
    if (process.env.NODE_ENV !== 'production' && token === '123456') {
      console.log('Using test verification code');
      return true;
    }
    
    // Verify the token with the authenticator library
    // For Google Authenticator, this is the correct format
    return authenticator.check(token, secret);
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
      } as any) // Type assertion to bypass TypeScript checking until migration is complete
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
      } as any) // Type assertion to bypass TypeScript checking until migration is complete
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
    return (user as any).mfaEnabled || ['admin', 'provider'].includes(user.role);
  } catch (error) {
    console.error('Error checking MFA requirement:', error);
    return false;
  }
}