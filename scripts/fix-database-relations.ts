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
    
    // First, check if we have any invalid provider references
    console.log("Checking for invalid provider references...");
    const invalidProviderRefs = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM patient_profiles 
      WHERE provider_id IS NOT NULL AND 
            NOT EXISTS (SELECT 1 FROM provider_profiles WHERE id = provider_id);
    `);
    
    console.log("Invalid provider references:", invalidProviderRefs.rows[0].count);
    
    // Type assertion to safely convert the count to a number
    const invalidCount = Number(invalidProviderRefs.rows[0].count);
    if (invalidCount > 0) {
      console.log("Creating default provider to maintain referential integrity...");
      // Create a default provider to maintain referential integrity
      const defaultProvider = await db.execute(sql`
        INSERT INTO provider_profiles (
          user_id, 
          first_name, 
          last_name, 
          title,
          specialization, 
          npi, 
          phone,
          address,
          credentials,
          availability,
          created_at, 
          updated_at
        ) 
        VALUES (
          (SELECT id FROM users WHERE role = 'admin' LIMIT 1), 
          'System', 
          'Provider',
          'MD',
          'General',
          'TEMP-NPI',
          '(555) 000-0000',
          'System Address',
          '{"license": "TEMP-LICENSE", "education": "System University"}',
          '{"monday": "9:00-17:00", "tuesday": "9:00-17:00", "wednesday": "9:00-17:00", "thursday": "9:00-17:00", "friday": "9:00-17:00"}',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        RETURNING id;
      `);
      
      const defaultProviderId = defaultProvider.rows[0].id;
      console.log("Created default provider with ID:", defaultProviderId);
      
      // Fix orphaned references by pointing to the default provider
      await db.execute(sql`
        UPDATE patient_profiles 
        SET provider_id = ${defaultProviderId}
        WHERE provider_id IS NOT NULL AND 
              NOT EXISTS (SELECT 1 FROM provider_profiles WHERE id = provider_id);
      `);
    }
    
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
    
    // First, clean up invalid references in medical_records
    console.log("Cleaning up invalid medical record references...");
    await db.execute(sql`
      -- Identify and clean invalid patient references
      UPDATE medical_records 
      SET patient_profile_id = NULL
      WHERE patient_profile_id IS NOT NULL AND 
            NOT EXISTS (SELECT 1 FROM patient_profiles WHERE id = patient_profile_id);
            
      -- Identify and clean invalid provider references
      UPDATE medical_records 
      SET provider_profile_id = NULL
      WHERE provider_profile_id IS NOT NULL AND 
            NOT EXISTS (SELECT 1 FROM provider_profiles WHERE id = provider_profile_id);
    `);
    
    // Now add proper constraints
    console.log("Adding proper medical records constraints...");
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
        
        -- Patient profiles are required for medical records
        -- We'll check if we have nulls first and handle them
        UPDATE medical_records
        SET patient_profile_id = (
          SELECT id FROM patient_profiles LIMIT 1
        )
        WHERE patient_profile_id IS NULL
        AND EXISTS (SELECT 1 FROM patient_profiles LIMIT 1);
        
        -- If we still have null patient_profile_id records and no patients exist, 
        -- we'll need to remove those records as they're invalid
        DELETE FROM medical_records
        WHERE patient_profile_id IS NULL;
        
        -- Now we can add the constraint
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