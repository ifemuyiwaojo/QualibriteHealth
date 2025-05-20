/**
 * Emergency Superadmin Account Unlock Script
 * 
 * This script provides a secure way to unlock superadmin accounts that have been
 * locked due to failed login attempts.
 * 
 * IMPORTANT: Run this script with caution, it should be used only in emergency situations
 * when a superadmin account has been locked out and no other admin can unlock it.
 * 
 * Usage:
 * 1. Connect to the server environment
 * 2. Run: node scripts/unlock-superadmin-account.js superadmin@qualibritehealth.com
 * 
 * The script requires providing the email address of the superadmin account to unlock.
 */

const { db } = require('../db');
const { users, auditLogs } = require('../db/schema');
const { eq } = require('drizzle-orm');

async function unlockSuperadminAccount(email) {
  if (!email) {
    console.error('Error: Please provide a superadmin email address');
    console.log('Usage: node scripts/unlock-superadmin-account.js superadmin@example.com');
    process.exit(1);
  }

  try {
    console.log(`Attempting to unlock superadmin account: ${email}`);
    
    // Get user details to verify it's a superadmin
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      console.error(`Error: No user found with email ${email}`);
      process.exit(1);
    }

    if (!user.isSuperadmin) {
      console.error(`Error: User ${email} is not a superadmin. This script is only for superadmin accounts.`);
      process.exit(1);
    }

    // Check if account is actually locked
    if (!user.accountLocked) {
      console.log(`Notice: Account for ${email} is not currently locked. No action needed.`);
      process.exit(0);
    }

    // Unlock the account
    await db.update(users)
      .set({
        accountLocked: false,
        lockExpiresAt: null,
        failedLoginAttempts: 0,
        lastFailedLogin: null
      })
      .where(eq(users.id, user.id));

    // Log the action for audit purposes
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'SUPERADMIN_EMERGENCY_UNLOCK',
      resourceType: 'USER',
      resourceId: user.id,
      details: {
        reason: 'Emergency unlock via console script',
        unlockedBy: 'manual_script',
        previousLockStatus: {
          lockedSince: user.lastFailedLogin,
          failedAttempts: user.failedLoginAttempts
        }
      }
    });

    console.log(`Success: Superadmin account ${email} has been unlocked.`);
    console.log('A security audit log has been created for this action.');
  } catch (error) {
    console.error('Error unlocking account:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];
unlockSuperadminAccount(email).catch(console.error).finally(() => process.exit(0));