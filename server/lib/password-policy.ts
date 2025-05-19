/**
 * Password Policy Service
 * 
 * This module provides functionality for password policy validation and enforcement
 * as part of Phase 2 security improvements for Qualibrite Health.
 */

import { db } from '@db';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { Logger } from './logger';

// Configuration
const MIN_PASSWORD_LENGTH = 10;
const REQUIRE_UPPERCASE = true;
const REQUIRE_LOWERCASE = true;
const REQUIRE_NUMBERS = true;
const REQUIRE_SPECIAL_CHARS = true;
const PASSWORD_HISTORY_SIZE = 3;
const MAX_PASSWORD_AGE_DAYS = 90;

// Special characters for password complexity
const SPECIAL_CHARS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

/**
 * Validate password complexity requirements
 * 
 * @param password Password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordComplexity(password: string): {
  valid: boolean;
  message?: string;
} {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  }
  
  // Check for uppercase letters
  if (REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for lowercase letters
  if (REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for numbers
  if (REQUIRE_NUMBERS && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for special characters
  if (REQUIRE_SPECIAL_CHARS && !new RegExp(`[${SPECIAL_CHARS.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`).test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  if (errors.length > 0) {
    return {
      valid: false,
      message: errors.join('. ')
    };
  }
  
  return { valid: true };
}

/**
 * Store password in user's password history
 * 
 * @param userId User ID
 * @param hashedPassword Hashed password to store in history
 */
export async function storePasswordInHistory(userId: number, hashedPassword: string): Promise<void> {
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
    const metadata = userData.metadata || {};
    
    // Initialize password history if not exists
    if (!metadata.passwordHistory) {
      metadata.passwordHistory = [];
    }
    
    // Add new password to history
    metadata.passwordHistory.unshift({
      hash: hashedPassword,
      changedAt: new Date().toISOString()
    });
    
    // Maintain history size limit
    if (metadata.passwordHistory.length > PASSWORD_HISTORY_SIZE) {
      metadata.passwordHistory = metadata.passwordHistory.slice(0, PASSWORD_HISTORY_SIZE);
    }
    
    // Update user metadata
    await db.update(users)
      .set({
        metadata: metadata as any,
        passwordLastChanged: new Date()
      })
      .where(eq(users.id, userId));
    
  } catch (error) {
    console.error("Error storing password in history:", error);
    // This is non-critical, so we just log the error but don't throw
    Logger.logError(error as Error, 'auth', {
      userId,
      details: { message: 'Failed to store password in history' }
    });
  }
}

/**
 * Check if a password has been used recently by the user
 * 
 * @param userId User ID
 * @param hashedPassword Hashed password to check
 * @param bcryptCompare Function to compare hashed passwords
 * @returns Whether password has been used recently
 */
export async function isPasswordReuseAllowed(
  userId: number, 
  plainPassword: string,
  bcryptCompare: (plain: string, hashed: string) => Promise<boolean>
): Promise<boolean> {
  try {
    // Get user data
    const [userData] = await db.select({
      metadata: users.metadata
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      return true; // Allow if user not found (error case)
    }
    
    // Parse metadata
    const metadata = userData.metadata || {};
    
    // If no password history, reuse is allowed
    if (!metadata.passwordHistory || metadata.passwordHistory.length === 0) {
      return true;
    }
    
    // Check each password in history
    for (const historyEntry of metadata.passwordHistory) {
      const isMatch = await bcryptCompare(plainPassword, historyEntry.hash);
      if (isMatch) {
        return false; // Password has been used recently
      }
    }
    
    return true; // Password hasn't been used recently
  } catch (error) {
    console.error("Error checking password reuse:", error);
    // In case of error, fail safe (allow reuse rather than blocking change)
    return true;
  }
}

/**
 * Check if a user's password has expired and needs to be changed
 * 
 * @param userId User ID
 * @returns Whether password has expired
 */
export async function isPasswordExpired(userId: number): Promise<boolean> {
  try {
    // Get user data
    const [userData] = await db.select({
      passwordLastChanged: users.passwordLastChanged,
      requiresPasswordChange: users.requiresPasswordChange
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      return false; // User not found
    }
    
    // If forced password change is required
    if (userData.requiresPasswordChange) {
      return true;
    }
    
    // If password last changed date is not set
    if (!userData.passwordLastChanged) {
      return false; // Assume it's a new account
    }
    
    // Calculate password age
    const passwordAge = new Date().getTime() - userData.passwordLastChanged.getTime();
    const passwordAgeDays = passwordAge / (1000 * 60 * 60 * 24);
    
    return passwordAgeDays > MAX_PASSWORD_AGE_DAYS;
  } catch (error) {
    console.error("Error checking password expiry:", error);
    // In case of error, fail safe (don't force password change)
    return false;
  }
}

/**
 * Mark a user as requiring a password change
 * 
 * @param userId User ID to mark
 * @param adminId Optional ID of admin who required the change
 */
export async function requirePasswordChange(userId: number, adminId?: number): Promise<void> {
  try {
    await db.update(users)
      .set({
        requiresPasswordChange: true
      })
      .where(eq(users.id, userId));
    
    if (adminId) {
      await Logger.logSecurity("Password change required by administrator", {
        userId,
        details: { adminId }
      });
    } else {
      await Logger.logSecurity("Password change required by system policy", {
        userId
      });
    }
  } catch (error) {
    console.error("Error requiring password change:", error);
    throw new Error("Failed to update password change requirement");
  }
}