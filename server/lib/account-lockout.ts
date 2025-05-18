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

// Configuration for account lockout
const MAX_FAILED_ATTEMPTS = 5;          // Max number of failed attempts before locking
const LOCKOUT_DURATION_MINUTES = 30;    // Time in minutes account remains locked
const ATTEMPT_RESET_HOURS = 24;         // Time in hours to reset counter if no failed attempts

/**
 * Record a failed login attempt and potentially lock the account
 * 
 * @param userId User ID that failed authentication
 * @param ipAddress IP address of the request
 * @returns Object containing lockout status and remaining attempts
 */
export async function recordFailedLoginAttempt(userId: number, ipAddress?: string): Promise<{
  accountLocked: boolean;
  remainingAttempts: number;
  lockExpiresAt?: Date;
}> {
  // Get current user data
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if account is already locked
  if (user.accountLocked && user.lockExpiresAt && user.lockExpiresAt > new Date()) {
    // Account is locked and lock has not expired
    return {
      accountLocked: true,
      remainingAttempts: 0,
      lockExpiresAt: user.lockExpiresAt
    };
  }
  
  // If lock has expired, unlock the account
  if (user.accountLocked && user.lockExpiresAt && user.lockExpiresAt <= new Date()) {
    await db.update(users)
      .set({
        accountLocked: false,
        lockExpiresAt: null,
        failedLoginAttempts: 0
      })
      .where(eq(users.id, userId));
    
    await Logger.logSecurity('Account automatically unlocked after lock period expired', {
      userId,
      details: { ipAddress }
    });
    
    return {
      accountLocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS
    };
  }
  
  // Check if we should reset failed attempts counter
  // If last failed login was more than ATTEMPT_RESET_HOURS ago
  if (user.lastFailedLogin) {
    const resetThreshold = new Date();
    resetThreshold.setHours(resetThreshold.getHours() - ATTEMPT_RESET_HOURS);
    
    if (user.lastFailedLogin < resetThreshold) {
      await db.update(users)
        .set({ failedLoginAttempts: 0 })
        .where(eq(users.id, userId));
        
      user.failedLoginAttempts = 0;
    }
  }
  
  // Increment failed attempts
  const failedAttempts = (user.failedLoginAttempts || 0) + 1;
  const now = new Date();
  
  // Check if account should be locked
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    // Calculate lock expiration time
    const lockExpiresAt = new Date();
    lockExpiresAt.setMinutes(lockExpiresAt.getMinutes() + LOCKOUT_DURATION_MINUTES);
    
    // Lock the account
    await db.update(users)
      .set({
        failedLoginAttempts: failedAttempts,
        lastFailedLogin: now,
        accountLocked: true,
        lockExpiresAt
      })
      .where(eq(users.id, userId));
    
    // Log the account lockout  
    await Logger.logSecurity('Account locked due to multiple failed login attempts', {
      userId,
      details: {
        attemptsBeforeLock: failedAttempts,
        lockExpiresAt,
        ipAddress
      }
    });
    
    return {
      accountLocked: true,
      remainingAttempts: 0,
      lockExpiresAt
    };
  } else {
    // Update failed attempts count without locking
    await db.update(users)
      .set({
        failedLoginAttempts: failedAttempts,
        lastFailedLogin: now
      })
      .where(eq(users.id, userId));
    
    // Log the failed attempt
    await Logger.logSecurity('Failed login attempt', {
      userId,
      details: {
        attempts: failedAttempts,
        remainingAttempts: MAX_FAILED_ATTEMPTS - failedAttempts,
        ipAddress
      }
    });
    
    return {
      accountLocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS - failedAttempts
    };
  }
}

/**
 * Reset failed login attempts for a user after successful authentication
 * 
 * @param userId User ID that successfully authenticated
 */
export async function resetFailedLoginAttempts(userId: number): Promise<void> {
  // Only reset if there were previously failed attempts
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (user && user.failedLoginAttempts && user.failedLoginAttempts > 0) {
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
  }
}

/**
 * Manually unlock a user account (for admin use)
 * 
 * @param userId User ID to unlock
 * @param adminId ID of admin performing the unlock
 */
export async function unlockAccount(userId: number, adminId: number): Promise<void> {
  await db.update(users)
    .set({
      failedLoginAttempts: 0,
      lastFailedLogin: null,
      accountLocked: false,
      lockExpiresAt: null
    })
    .where(eq(users.id, userId));
  
  await Logger.logSecurity('Account manually unlocked by admin', {
    userId,
    details: { adminId }
  });
}

/**
 * Check if a user account is locked
 * 
 * @param userId User ID to check
 * @returns Object with lock status and expiration time if locked
 */
export async function checkAccountLockStatus(userId: number): Promise<{
  isLocked: boolean;
  lockExpiresAt?: Date;
}> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if account is locked and lock has not expired
  if (user.accountLocked && user.lockExpiresAt && user.lockExpiresAt > new Date()) {
    return {
      isLocked: true,
      lockExpiresAt: user.lockExpiresAt
    };
  }
  
  // If lock has expired, unlock the account
  if (user.accountLocked && user.lockExpiresAt && user.lockExpiresAt <= new Date()) {
    await db.update(users)
      .set({
        accountLocked: false,
        lockExpiresAt: null
      })
      .where(eq(users.id, userId));
    
    return { isLocked: false };
  }
  
  return { isLocked: false };
}