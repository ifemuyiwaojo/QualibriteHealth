/**
 * Migration to fix database relations and access controls
 * This ensures all references between tables are properly established
 * and adds necessary constraints for data integrity.
 */

import { db } from "../index";
import { sql } from "drizzle-orm";
import { Logger } from "../../server/lib/logger";

export async function up() {
  try {
    console.log("Starting database relations fix migration...");
    
    // 1. Ensure proper references between patient_profiles and provider_profiles
    await db.execute(sql`
      -- Make sure provider_id in patient_profiles correctly references provider_profiles.id
      ALTER TABLE IF EXISTS patient_profiles 
      DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;
      
      ALTER TABLE IF EXISTS patient_profiles
      ADD CONSTRAINT patient_profiles_provider_id_fkey 
      FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) 
      ON DELETE SET NULL; -- Allow nulls if provider is removed
    `);
    
    // 2. Fix medical records references
    await db.execute(sql`
      -- Ensure medical_records correctly reference patient_profiles
      ALTER TABLE IF EXISTS medical_records 
      DROP CONSTRAINT IF EXISTS medical_records_patient_profile_id_fkey;
      
      ALTER TABLE IF EXISTS medical_records
      ADD CONSTRAINT medical_records_patient_profile_id_fkey 
      FOREIGN KEY (patient_profile_id) REFERENCES patient_profiles(id) 
      ON DELETE CASCADE; -- Records deleted if patient profile is deleted
      
      -- Ensure medical_records correctly reference provider_profiles
      ALTER TABLE IF EXISTS medical_records 
      DROP CONSTRAINT IF EXISTS medical_records_provider_profile_id_fkey;
      
      ALTER TABLE IF EXISTS medical_records
      ADD CONSTRAINT medical_records_provider_profile_id_fkey 
      FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles(id) 
      ON DELETE SET NULL; -- Allow nulls if provider is removed
    `);
    
    // 3. Fix appointments references
    await db.execute(sql`
      -- Update appointments to reference profiles, not just user IDs
      -- First create new columns to hold the profile references
      ALTER TABLE IF EXISTS appointments 
      ADD COLUMN IF NOT EXISTS patient_profile_id INTEGER REFERENCES patient_profiles(id),
      ADD COLUMN IF NOT EXISTS provider_profile_id INTEGER REFERENCES provider_profiles(id);
      
      -- Update the new columns based on existing user references
      -- We'll need to join with profiles to populate these properly
      UPDATE appointments a
      SET patient_profile_id = pp.id
      FROM patient_profiles pp, users u
      WHERE a.patient_id = u.id AND pp.user_id = u.id;
      
      UPDATE appointments a
      SET provider_profile_id = pp.id
      FROM provider_profiles pp, users u
      WHERE a.provider_id = u.id AND pp.user_id = u.id;
    `);
    
    // 4. Add indexes on frequently queried columns for better performance
    await db.execute(sql`
      -- Add indexes for frequently queried columns
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_provider ON medical_records(provider_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_type ON medical_records(type);
      CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(date_time);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);
    
    console.log("Database relations fix migration completed.");
    return { success: true };
  } catch (error) {
    console.error("Database relations fix migration failed:", error);
    Logger.logError(error as Error, "system", { 
      details: { 
        migration: "fix_database_relations.ts",
        operation: "up" 
      } 
    });
    throw error;
  }
}

export async function down() {
  try {
    console.log("Rolling back database relations fix migration...");
    
    // Remove the indexes we created
    await db.execute(sql`
      DROP INDEX IF EXISTS idx_medical_records_patient;
      DROP INDEX IF EXISTS idx_medical_records_provider;
      DROP INDEX IF EXISTS idx_medical_records_type;
      DROP INDEX IF EXISTS idx_appointments_datetime;
      DROP INDEX IF EXISTS idx_appointments_status;
    `);
    
    // Remove the new columns we added to appointments
    await db.execute(sql`
      ALTER TABLE IF EXISTS appointments
      DROP COLUMN IF EXISTS patient_profile_id,
      DROP COLUMN IF EXISTS provider_profile_id;
    `);
    
    // Reset foreign key constraints to their default settings
    await db.execute(sql`
      -- Reset medical_records constraints
      ALTER TABLE IF EXISTS medical_records 
      DROP CONSTRAINT IF EXISTS medical_records_patient_profile_id_fkey,
      DROP CONSTRAINT IF EXISTS medical_records_provider_profile_id_fkey;
      
      ALTER TABLE IF EXISTS medical_records
      ADD CONSTRAINT medical_records_patient_profile_id_fkey 
      FOREIGN KEY (patient_profile_id) REFERENCES patient_profiles(id);
      
      ALTER TABLE IF EXISTS medical_records
      ADD CONSTRAINT medical_records_provider_profile_id_fkey 
      FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles(id);
      
      -- Reset patient_profiles constraints
      ALTER TABLE IF EXISTS patient_profiles 
      DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;
      
      ALTER TABLE IF EXISTS patient_profiles
      ADD CONSTRAINT patient_profiles_provider_id_fkey 
      FOREIGN KEY (provider_id) REFERENCES provider_profiles(id);
    `);
    
    console.log("Database relations fix migration rollback completed.");
    return { success: true };
  } catch (error) {
    console.error("Database relations fix migration rollback failed:", error);
    Logger.logError(error as Error, "system", { 
      details: { 
        migration: "fix_database_relations.ts",
        operation: "down" 
      } 
    });
    throw error;
  }
}