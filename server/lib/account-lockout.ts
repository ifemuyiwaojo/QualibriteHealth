/**
 * Account Lockout Service
 * 
 * This module provides functionality for managing account lockouts
 * as part of Phase 2 security improvements for Qualibrite Health.
 */

import { db } from '@db';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { Logger } from './logger';

// Configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

/**
 * Record a failed login attempt for a user
 * 
 * @param userId User ID that failed to authenticate
 * @param ipAddress Optional IP address of the client for logging
 * @returns Object with lock status
 */
export async function recordFailedLoginAttempt(userId: number, ipAddress?: string): Promise<{
  isLocked: boolean;
  attempts: number;
  lockExpiresAt?: Date;
}> {
  try {
    // Fetch current user data
    const [userData] = await db.select({
      failedLoginAttempts: users.failedLoginAttempts,
      accountLocked: users.accountLocked,
      lockExpiresAt: users.lockExpiresAt
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if account is already locked
    if (userData.accountLocked) {
      const now = new Date();
      
      // If lock has expired, unlock the account
      if (userData.lockExpiresAt && userData.lockExpiresAt < now) {
        await db.update(users)
          .set({
            accountLocked: false,
            lockExpiresAt: null,
            failedLoginAttempts: 1, // Reset counter but add this attempt
            lastFailedLogin: new Date()
          })
          .where(eq(users.id, userId));
          
        await Logger.logSecurity("Account lock expired and reset", {
          userId,
          ipAddress,
          details: { newAttemptCount: 1 }
        });
        
        return { isLocked: false, attempts: 1 };
      }
      
      // Account is still locked
      return { 
        isLocked: true, 
        attempts: userData.failedLoginAttempts ?? 0,
        lockExpiresAt: userData.lockExpiresAt ?? undefined
      };
    }
    
    // Increment failed login counter
    const newAttemptCount = (userData.failedLoginAttempts ?? 0) + 1;
    
    // Check if account should be locked
    if (newAttemptCount >= MAX_FAILED_ATTEMPTS) {
      // Lock the account
      const lockExpiresAt = new Date();
      lockExpiresAt.setMinutes(lockExpiresAt.getMinutes() + LOCKOUT_DURATION_MINUTES);
      
      await db.update(users)
        .set({
          failedLoginAttempts: newAttemptCount,
          lastFailedLogin: new Date(),
          accountLocked: true,
          lockExpiresAt
        })
        .where(eq(users.id, userId));
      
      await Logger.logSecurity("Account locked due to too many failed login attempts", {
        userId,
        ipAddress,
        details: { 
          attempts: newAttemptCount,
          lockDuration: LOCKOUT_DURATION_MINUTES,
          expiresAt: lockExpiresAt
        }
      });
      
      return { 
        isLocked: true, 
        attempts: newAttemptCount,
        lockExpiresAt 
      };
    } else {
      // Update failed attempts counter
      await db.update(users)
        .set({
          failedLoginAttempts: newAttemptCount,
          lastFailedLogin: new Date()
        })
        .where(eq(users.id, userId));
      
      await Logger.logSecurity("Failed login attempt recorded", {
        userId,
        ipAddress,
        details: { 
          attempts: newAttemptCount,
          maxAttempts: MAX_FAILED_ATTEMPTS,
          attemptsRemaining: MAX_FAILED_ATTEMPTS - newAttemptCount
        }
      });
      
      return { isLocked: false, attempts: newAttemptCount };
    }
  } catch (error) {
    console.error("Error recording failed login attempt:", error);
    // In case of error, fail safe (don't lock the account)
    return { isLocked: false, attempts: 0 };
  }
}

/**
 * Reset failed login attempts for a user after successful authentication
 * 
 * @param userId User ID that successfully authenticated
 */
export async function resetFailedLoginAttempts(userId: number): Promise<void> {
  try {
    await db.update(users)
      .set({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        accountLocked: false,
        lockExpiresAt: null
      })
      .where(eq(users.id, userId));
      
    await Logger.log('info', 'auth', 'Failed login attempts reset after successful login', {
      userId
    });
  } catch (error) {
    console.error("Error resetting failed login attempts:", error);
  }
}

/**
 * Manually unlock a user account (for admin use)
 * 
 * @param userId User ID to unlock
 * @param adminId ID of admin performing the unlock
 */
export async function unlockAccount(userId: number, adminId: number): Promise<void> {
  try {
    await db.update(users)
      .set({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        accountLocked: false,
        lockExpiresAt: null
      })
      .where(eq(users.id, userId));
      
    await Logger.logSecurity("Account manually unlocked by administrator", {
      userId,
      details: { adminId }
    });
  } catch (error) {
    console.error("Error unlocking account:", error);
    throw new Error("Failed to unlock account");
  }
}

/**
 * Check if a user account is locked
 * 
 * @param userId User ID to check
 * @returns Object with lock status and expiration time if locked
 */
export async function checkAccountLockStatus(userId: number): Promise<{
  isLocked: boolean;
  attempts: number;
  lockExpiresAt?: Date;
}> {
  try {
    const [userData] = await db.select({
      failedLoginAttempts: users.failedLoginAttempts,
      accountLocked: users.accountLocked,
      lockExpiresAt: users.lockExpiresAt
    })
    .from(users)
    .where(eq(users.id, userId));
    
    if (!userData) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Check if account is locked but lock has expired
    if (userData.accountLocked && userData.lockExpiresAt) {
      const now = new Date();
      if (userData.lockExpiresAt < now) {
        // Lock has expired, but account is still marked as locked in DB
        // We'll not update the DB here, just return the correct status
        return { 
          isLocked: false, 
          attempts: userData.failedLoginAttempts ?? 0
        };
      }
    }
    
    return {
      isLocked: userData.accountLocked ?? false,
      attempts: userData.failedLoginAttempts ?? 0,
      lockExpiresAt: userData.lockExpiresAt ?? undefined
    };
  } catch (error) {
    console.error("Error checking account lock status:", error);
    // In case of error, fail safe (don't block access)
    return { isLocked: false, attempts: 0 };
  }
}