/**
 * Complete database relations fix script for Qualibrite Health
 * This script addresses Phase 1 security improvements:
 * - Fixes provider relationship in patient_profiles
 * - Ensures proper referential integrity for medical records
 * - Adds performance indexes for frequently accessed fields
 */

import pg from 'pg';
const { Client } = pg;

async function main() {
  // Connect to the database using the environment variable
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    // Begin transaction
    await client.query('BEGIN');
    
    console.log('1. Making provider_id nullable temporarily...');
    await client.query(`
      ALTER TABLE patient_profiles 
      ALTER COLUMN provider_id DROP NOT NULL;
    `);
    
    console.log('2. Dropping existing foreign key constraint...');
    await client.query(`
      ALTER TABLE IF EXISTS patient_profiles
      DROP CONSTRAINT IF EXISTS patient_profiles_provider_id_fkey;
    `);
    
    console.log('3. Checking for provider profiles...');
    const providerCheck = await client.query('SELECT COUNT(*) FROM provider_profiles');
    if (parseInt(providerCheck.rows[0].count) === 0) {
      console.log('   No provider profiles found. Creating a default provider...');
      
      // First, find an admin or provider user to associate with
      const userCheck = await client.query(`
        SELECT id FROM users 
        WHERE role IN ('admin', 'provider') 
        LIMIT 1
      `);
      
      if (userCheck.rows.length === 0) {
        throw new Error('No admin or provider users found to create default provider');
      }
      
      const userId = userCheck.rows[0].id;
      console.log(`   Using user ID ${userId} for default provider`);
      
      // Create a default provider profile
      await client.query(`
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
          $1,
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
      `, [userId]);
    }
    
    console.log('4. Updating provider references in patient profiles...');
    // Get the first available provider
    const defaultProvider = await client.query('SELECT id FROM provider_profiles LIMIT 1');
    
    if (defaultProvider.rows.length === 0) {
      throw new Error('No provider profiles available after attempted creation');
    }
    
    const defaultProviderId = defaultProvider.rows[0].id;
    console.log(`   Using default provider ID: ${defaultProviderId}`);
    
    // Update patient profiles to use valid provider reference
    await client.query(`
      UPDATE patient_profiles
      SET provider_id = $1
      WHERE provider_id IS NULL OR 
            NOT EXISTS (SELECT 1 FROM provider_profiles WHERE id = provider_id);
    `, [defaultProviderId]);
    
    console.log('5. Adding new foreign key constraint to provider_profiles...');
    await client.query(`
      ALTER TABLE patient_profiles
      ADD CONSTRAINT patient_profiles_provider_id_fkey
      FOREIGN KEY (provider_id) REFERENCES provider_profiles(id);
    `);
    
    console.log('6. Fixing medical records references...');
    // Drop existing constraints if they exist
    await client.query(`
      ALTER TABLE IF EXISTS medical_records
      DROP CONSTRAINT IF EXISTS medical_records_patient_profile_id_fkey,
      DROP CONSTRAINT IF EXISTS medical_records_provider_profile_id_fkey;
    `);
    
    // Update medical records to use valid patient and provider references
    await client.query(`
      UPDATE medical_records
      SET provider_profile_id = $1
      WHERE provider_profile_id IS NULL OR
            NOT EXISTS (SELECT 1 FROM provider_profiles WHERE id = provider_profile_id);
    `, [defaultProviderId]);
    
    // Get the first available patient
    const defaultPatient = await client.query('SELECT id FROM patient_profiles LIMIT 1');
    
    if (defaultPatient.rows.length === 0) {
      // If no patients exist, we need to handle this case
      console.log('   No patient profiles found. Medical records may be invalid.');
      // Remove orphaned medical records
      await client.query(`
        DELETE FROM medical_records
        WHERE patient_profile_id IS NULL OR
              NOT EXISTS (SELECT 1 FROM patient_profiles WHERE id = patient_profile_id);
      `);
    } else {
      const defaultPatientId = defaultPatient.rows[0].id;
      console.log(`   Using default patient ID: ${defaultPatientId}`);
      
      // Update orphaned medical records to use valid patient reference
      await client.query(`
        UPDATE medical_records
        SET patient_profile_id = $1
        WHERE patient_profile_id IS NULL OR
              NOT EXISTS (SELECT 1 FROM patient_profiles WHERE id = patient_profile_id);
      `, [defaultPatientId]);
    }
    
    // Add new constraints
    console.log('7. Adding proper medical records constraints...');
    await client.query(`
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_patient_profile_id_fkey
      FOREIGN KEY (patient_profile_id) REFERENCES patient_profiles(id)
      ON DELETE CASCADE;
      
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_provider_profile_id_fkey
      FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles(id)
      ON DELETE SET NULL;
    `);
    
    console.log('8. Adding performance indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_provider ON medical_records(provider_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
    `);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database relations fix completed successfully!');
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error fixing database relations:', error);
  } finally {
    // Close the connection
    await client.end();
  }
}

main().catch(e => {
  console.error('Unhandled error:', e);
  process.exit(1);
});