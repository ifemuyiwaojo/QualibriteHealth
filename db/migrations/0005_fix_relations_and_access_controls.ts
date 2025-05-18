import { sql } from "drizzle-orm";
import { pgTable, foreignKey, integer, text, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";

export async function up(db) {
  console.log("Running migration to fix relations and implement access controls...");

  // 1. Fix patient_profiles to provider_profiles relationship
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

  // 2. Fix medical_records references
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

  // 3. Add performance indexes for frequently queried columns
  await db.execute(sql`
    -- Add indexes if they don't exist (will silently skip if they do)
    CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_profile_id);
    CREATE INDEX IF NOT EXISTS idx_medical_records_provider ON medical_records(provider_profile_id);
    CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
  `);

  console.log("Migration completed successfully");
}

export async function down(db) {
  console.log("Rolling back relation and access control fixes...");

  // Remove the indexes we created
  await db.execute(sql`
    DROP INDEX IF EXISTS idx_medical_records_patient;
    DROP INDEX IF EXISTS idx_medical_records_provider;
    DROP INDEX IF EXISTS idx_medical_records_visit_date;
    DROP INDEX IF EXISTS idx_audit_logs_user;
    DROP INDEX IF EXISTS idx_audit_logs_resource;
  `);

  // Reset constraints to default
  await db.execute(sql`
    DO $$ 
    BEGIN
      -- Reset patient_profiles constraint
      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'patient_profiles_provider_id_fkey'
      ) THEN
        ALTER TABLE patient_profiles DROP CONSTRAINT patient_profiles_provider_id_fkey;
      END IF;
      
      ALTER TABLE patient_profiles
      ADD CONSTRAINT patient_profiles_provider_id_fkey 
      FOREIGN KEY (provider_id) REFERENCES provider_profiles(id);

      -- Reset medical_records constraints
      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'medical_records_patient_profile_id_fkey'
      ) THEN
        ALTER TABLE medical_records DROP CONSTRAINT medical_records_patient_profile_id_fkey;
      END IF;
      
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_patient_profile_id_fkey 
      FOREIGN KEY (patient_profile_id) REFERENCES patient_profiles(id);

      IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'medical_records_provider_profile_id_fkey'
      ) THEN
        ALTER TABLE medical_records DROP CONSTRAINT medical_records_provider_profile_id_fkey;
      END IF;
      
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_provider_profile_id_fkey 
      FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles(id);
    END $$;
  `);

  console.log("Rollback completed successfully");
}