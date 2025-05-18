/**
 * Migration to add Multi-Factor Authentication support
 * This is part of Phase 2 security improvements for Qualibrite Health
 */

import { db } from "../index";
import { sql } from "drizzle-orm";
import { Logger } from "../../server/lib/logger";

export async function up() {
  try {
    console.log("Starting MFA support migration...");
    
    // Add MFA fields to the users table
    await db.execute(sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS mfa_secret TEXT,
      ADD COLUMN IF NOT EXISTS mfa_backup_codes JSONB;
    `);
    
    console.log("MFA fields added successfully");
    return { success: true };
  } catch (error) {
    console.error("MFA support migration failed:", error);
    Logger.logError(error as Error, "system", { 
      details: { 
        migration: "add_mfa_support.ts",
        operation: "up" 
      } 
    });
    throw error;
  }
}

export async function down() {
  try {
    console.log("Rolling back MFA support migration...");
    
    // Remove MFA fields from the users table
    await db.execute(sql`
      ALTER TABLE users
      DROP COLUMN IF EXISTS mfa_enabled,
      DROP COLUMN IF EXISTS mfa_secret,
      DROP COLUMN IF EXISTS mfa_backup_codes;
    `);
    
    console.log("MFA fields removed successfully");
    return { success: true };
  } catch (error) {
    console.error("MFA support migration rollback failed:", error);
    Logger.logError(error as Error, "system", { 
      details: { 
        migration: "add_mfa_support.ts",
        operation: "down" 
      } 
    });
    throw error;
  }
}