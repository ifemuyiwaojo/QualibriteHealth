/**
 * Emergency Superadmin Account Unlock Script
 * 
 * This script is intended for emergency use only when superadmin accounts are locked.
 * It should only be used by authorized system administrators with direct database access.
 * 
 * Usage: node scripts/unlock-superadmin.js <superadmin_email>
 */

const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function unlockSuperadminAccount(email) {
  if (!email) {
    console.error('Error: Superadmin email address is required.');
    console.log('Usage: node scripts/unlock-superadmin.js <superadmin_email>');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    // First, verify this is actually a superadmin account
    const checkResult = await pool.query(`
      SELECT id, email, role, is_superadmin, account_locked
      FROM users
      WHERE email = $1 AND is_superadmin = true
    `, [email]);

    if (checkResult.rows.length === 0) {
      console.error(`Error: No superadmin account found with email ${email}`);
      process.exit(1);
    }

    const user = checkResult.rows[0];
    
    if (!user.account_locked) {
      console.log(`Superadmin account ${email} is not locked. No action needed.`);
      process.exit(0);
    }

    // Unlock the account
    const result = await pool.query(`
      UPDATE users
      SET 
        account_locked = false,
        failed_login_attempts = 0,
        last_failed_login = NULL,
        lock_expires_at = NULL
      WHERE email = $1 AND is_superadmin = true
      RETURNING id, email
    `, [email]);

    if (result.rows.length > 0) {
      console.log(`SUCCESS: Superadmin account ${email} has been unlocked.`);
      
      // Log this emergency action
      await pool.query(`
        INSERT INTO audit_logs (
          user_id, 
          action, 
          resource_type, 
          resource_id, 
          details,
          ip_address
        )
        VALUES ($1, 'EMERGENCY_UNLOCK', 'USER', $2, $3, 'system')
      `, [
        result.rows[0].id,
        result.rows[0].id,
        JSON.stringify({
          reason: 'Emergency superadmin account unlock via CLI script',
          timestamp: new Date().toISOString(),
          executor: 'system_admin'
        })
      ]);
      
      console.log('A security audit log of this action has been recorded.');
    } else {
      console.error(`Error: Failed to unlock superadmin account ${email}`);
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    pool.end();
  }
}

// Execute the script with the email provided as command-line argument
unlockSuperadminAccount(process.argv[2]);