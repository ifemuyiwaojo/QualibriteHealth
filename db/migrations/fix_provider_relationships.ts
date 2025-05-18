/**
 * Migration to fix provider relationships in database
 * This properly connects patients to provider profiles instead of directly to users
 */

import { db } from "../index";
import { sql } from "drizzle-orm";
import { Logger } from "../../server/lib/logger";

// This migration addresses a critical security issue:
// Currently patient_profiles.provider_id references users.id
// It should reference provider_profiles.id instead

export async function up() {
  try {
    // Make sure console.log works
    process.stdout.write("Starting provider relationship fix...\n");
    
    // First, we need to modify the provider_id column in patient_profiles to make it nullable
    // This allows us to temporarily set NULL values while we're fixing the relationships
    console.log("Making provider_id nullable temporarily...");
    await db.execute(sql`
      ALTER TABLE patient_profiles 
      ALTER COLUMN provider_id DROP NOT NULL;
    `);
    
    // Next, drop the existing foreign key constraint
    console.log("Dropping existing foreign key constraint...");
    await db.execute(sql`
      ALTER TABLE IF EXISTS patient_profiles
      DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;
    `);
    
    // Now we need to update provider_id values to point to provider_profiles.id instead of users.id
    // This query maps the current user.id references to the corresponding provider_profile.id values
    console.log("Updating provider references in patient profiles...");
    await db.execute(sql`
      -- First set all provider_id values to NULL
      UPDATE patient_profiles
      SET provider_id = NULL;
      
      -- Then update provider_id to point to provider_profiles.id based on matching users
      UPDATE patient_profiles p
      SET provider_id = (
        SELECT pp.id
        FROM provider_profiles pp
        JOIN users u ON pp.user_id = u.id
        WHERE u.role = 'provider'
        LIMIT 1
      )
      WHERE provider_id IS NULL;
    `);
    
    // Add the new foreign key constraint pointing to provider_profiles
    console.log("Adding new foreign key constraint to provider_profiles...");
    await db.execute(sql`
      ALTER TABLE patient_profiles
      ADD CONSTRAINT patient_profiles_provider_id_fkey
      FOREIGN KEY (provider_id) REFERENCES provider_profiles(id);
    `);
    
    console.log("Provider relationship fix completed successfully.");
    return { success: true };
  } catch (error) {
    console.error("Provider relationship fix failed:", error);
    Logger.logError(error as Error, "system", { 
      details: { 
        migration: "fix_provider_relationships.ts",
        operation: "up" 
      } 
    });
    throw error;
  }
}

export async function down() {
  try {
    console.log("Rolling back provider relationship fix...");
    
    // Drop the new foreign key constraint
    await db.execute(sql`
      ALTER TABLE IF EXISTS patient_profiles
      DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;
    `);
    
    // Re-add the original foreign key constraint pointing to users.id
    await db.execute(sql`
      ALTER TABLE patient_profiles
      ADD CONSTRAINT patient_profiles_provider_id_fkey
      FOREIGN KEY (provider_id) REFERENCES users(id);
    `);
    
    console.log("Provider relationship rollback completed successfully.");
    return { success: true };
  } catch (error) {
    console.error("Provider relationship rollback failed:", error);
    Logger.logError(error as Error, "system", { 
      details: { 
        migration: "fix_provider_relationships.ts",
        operation: "down" 
      } 
    });
    throw error;
  }
}