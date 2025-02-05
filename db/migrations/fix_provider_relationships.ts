import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../index";

// This migration fixes the provider-patient relationships
export async function up() {
  await db.execute(sql`
    -- Temporarily remove the constraint
    ALTER TABLE patient_profiles 
    DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;

    -- Update provider_id to reference provider_profiles
    UPDATE patient_profiles pp
    SET provider_id = (
      SELECT provider_profiles.id
      FROM provider_profiles
      JOIN users ON users.id = provider_profiles.user_id
      WHERE users.id = pp.provider_id
    );

    -- Add the correct foreign key constraint
    ALTER TABLE patient_profiles
    ADD CONSTRAINT patient_profiles_provider_id_fkey 
    FOREIGN KEY (provider_id) REFERENCES provider_profiles(id);
  `);
}

export async function down() {
  await db.execute(sql`
    ALTER TABLE patient_profiles 
    DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;

    ALTER TABLE patient_profiles
    ADD CONSTRAINT patient_profiles_provider_id_fkey 
    FOREIGN KEY (provider_id) REFERENCES users(id);
  `);
}
