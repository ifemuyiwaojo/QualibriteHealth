/**
 * Script to fix database relations for Phase 1 Security Improvements
 * This applies critical security fixes to database relationships
 */

import { db, pool } from "../db";
import { sql } from "drizzle-orm";
import { Logger } from "../server/lib/logger";

async function main() {
  console.log("Starting database relations fix...");

  try {
    // Fix patient_profiles to provider_profiles relationship
    console.log("Fixing patient-provider relationships...");
    
    // First, clean up invalid references in patient_profiles
    console.log("Cleaning up invalid provider references...");
    await db.execute(sql`
      -- Update any patient profiles with provider_id that doesn't exist in provider_profiles
      -- Set to NULL as these are orphaned references
      UPDATE patient_profiles 
      SET provider_id = NULL
      WHERE provider_id IS NOT NULL AND 
            NOT EXISTS (SELECT 1 FROM provider_profiles WHERE id = provider_id);
    `);
    
    // Now we can safely add the foreign key constraint
    console.log("Adding proper foreign key constraint...");
    await db.execute(sql`
      DO $$ 
      BEGIN
        -- Check if constraint exists before dropping
        IF EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'patient_profiles_provider_id_fkey'
        ) THEN
          ALTER TABLE patient_profiles DROP CONSTRAINT patient_profiles_provider_id_fkey;
        END IF;

        -- Add the constraint with proper reference
        ALTER TABLE patient_profiles
        ADD CONSTRAINT patient_profiles_provider_id_fkey 
        FOREIGN KEY (provider_id) REFERENCES provider_profiles(id) 
        ON DELETE SET NULL;
      END $$;
    `);

    // Fix medical_records references
    console.log("Fixing medical records references...");
    await db.execute(sql`
      DO $$ 
      BEGIN
        -- Fix patient profile reference
        IF EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'medical_records_patient_profile_id_fkey'
        ) THEN
          ALTER TABLE medical_records DROP CONSTRAINT medical_records_patient_profile_id_fkey;
        END IF;
        
        ALTER TABLE medical_records
        ADD CONSTRAINT medical_records_patient_profile_id_fkey 
        FOREIGN KEY (patient_profile_id) REFERENCES patient_profiles(id) 
        ON DELETE CASCADE;

        -- Fix provider profile reference
        IF EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'medical_records_provider_profile_id_fkey'
        ) THEN
          ALTER TABLE medical_records DROP CONSTRAINT medical_records_provider_profile_id_fkey;
        END IF;
        
        ALTER TABLE medical_records
        ADD CONSTRAINT medical_records_provider_profile_id_fkey 
        FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles(id) 
        ON DELETE SET NULL;
      END $$;
    `);

    // Add performance indexes for frequently queried columns
    console.log("Adding performance indexes...");
    await db.execute(sql`
      -- Add indexes if they don't exist (will silently skip if they do)
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_provider ON medical_records(provider_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
    `);

    console.log("Database relations fixed successfully!");
  } catch (error) {
    console.error("Error fixing database relations:", error);
  } finally {
    await pool.end();
  }
}

main().catch(e => {
  console.error("Unhandled error:", e);
  process.exit(1);
});