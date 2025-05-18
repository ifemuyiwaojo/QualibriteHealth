/**
 * Migration to add account lockout fields to users table
 * This is part of Phase 2 security improvements for Qualibrite Health
 * 
 * This adds fields to track failed login attempts and implement account lockout
 * features to prevent brute force attacks on user accounts.
 */

import { sql } from "drizzle-orm";
import { db, pool } from "../index";

export async function up() {
  await db.execute(sql`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP,
    ADD COLUMN IF NOT EXISTS account_locked BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS lock_expires_at TIMESTAMP;
  `);
  
  console.log("✅ Added account lockout fields to users table");
  
  return { success: true };
}

export async function down() {
  await db.execute(sql`
    ALTER TABLE users 
    DROP COLUMN IF EXISTS failed_login_attempts,
    DROP COLUMN IF EXISTS last_failed_login,
    DROP COLUMN IF EXISTS account_locked,
    DROP COLUMN IF EXISTS lock_expires_at;
  `);
  
  console.log("❌ Removed account lockout fields from users table");
  
  return { success: true };
}

// Run the migration if executed directly
if (require.main === module) {
  up()
    .then(() => {
      console.log("Migration completed successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}