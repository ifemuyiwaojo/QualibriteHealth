import { pool } from "@db";

export async function up() {
  try {
    console.log("Starting medical records schema migration...");
    
    // Start a transaction
    await pool.query('BEGIN');
    
    // Step 1: Create a mapping table to store the relation between user_id and profile_id for patients
    await pool.query(`
      CREATE TEMPORARY TABLE patient_id_mapping AS
      SELECT 
        u.id AS user_id,
        p.id AS profile_id
      FROM 
        users u
        JOIN patient_profiles p ON u.id = p.user_id;
    `);
    
    // Step 2: Create a mapping table for providers
    await pool.query(`
      CREATE TEMPORARY TABLE provider_id_mapping AS
      SELECT 
        u.id AS user_id,
        p.id AS profile_id
      FROM 
        users u
        JOIN provider_profiles p ON u.id = p.user_id;
    `);
    
    // Step 3: Update the structure of medical_records table without losing data
    await pool.query(`
      -- First create a new table with the correct structure
      CREATE TABLE medical_records_new (
        id SERIAL PRIMARY KEY,
        patient_profile_id INTEGER,
        provider_profile_id INTEGER,
        type VARCHAR(50) NOT NULL,
        visit_date TIMESTAMP NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Step 4: Copy data from old table to new, mapping IDs
    await pool.query(`
      INSERT INTO medical_records_new (
        id, 
        patient_profile_id, 
        provider_profile_id, 
        type, 
        visit_date, 
        content, 
        created_at, 
        updated_at
      )
      SELECT 
        m.id,
        pm.profile_id,
        ppm.profile_id,
        m.type,
        m.visit_date,
        m.content,
        m.created_at,
        m.updated_at
      FROM 
        medical_records m
        LEFT JOIN patient_id_mapping pm ON m.patient_id = pm.user_id
        LEFT JOIN provider_id_mapping ppm ON m.provider_id = ppm.user_id;
    `);
    
    // Step 5: Drop the old table and rename the new one
    await pool.query(`
      DROP TABLE medical_records;
      ALTER TABLE medical_records_new RENAME TO medical_records;
    `);
    
    // Step 6: Add foreign key constraints to the new table
    await pool.query(`
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_patient_profile_id_fkey
      FOREIGN KEY (patient_profile_id) REFERENCES patient_profiles(id) ON DELETE CASCADE;
      
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_provider_profile_id_fkey
      FOREIGN KEY (provider_profile_id) REFERENCES provider_profiles(id) ON DELETE CASCADE;
    `);
    
    // Step 7: Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient_profile_id ON medical_records(patient_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_provider_profile_id ON medical_records(provider_profile_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_type ON medical_records(type);
      CREATE INDEX IF NOT EXISTS idx_medical_records_visit_date ON medical_records(visit_date);
    `);
    
    // Commit the transaction
    await pool.query('COMMIT');
    console.log("Medical records schema updated successfully");
    
  } catch (error) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error("Migration failed:", error);
    throw error;
  }
}

export async function down() {
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // Create a mapping table to store the relation between profile_id and user_id
    await pool.query(`
      CREATE TEMPORARY TABLE patient_profile_to_user AS
      SELECT 
        p.id AS profile_id,
        p.user_id
      FROM 
        patient_profiles p;
        
      CREATE TEMPORARY TABLE provider_profile_to_user AS
      SELECT 
        p.id AS profile_id,
        p.user_id
      FROM 
        provider_profiles p;
    `);
    
    // Create new table with the old structure
    await pool.query(`
      CREATE TABLE medical_records_old (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        visit_date TIMESTAMP NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Copy data, mapping back to user IDs
    await pool.query(`
      INSERT INTO medical_records_old (
        id, 
        patient_id, 
        provider_id, 
        type, 
        visit_date, 
        content, 
        created_at, 
        updated_at
      )
      SELECT 
        m.id,
        pu.user_id,
        pru.user_id,
        m.type,
        m.visit_date,
        m.content,
        m.created_at,
        m.updated_at
      FROM 
        medical_records m
        LEFT JOIN patient_profile_to_user pu ON m.patient_profile_id = pu.profile_id
        LEFT JOIN provider_profile_to_user pru ON m.provider_profile_id = pru.profile_id;
    `);
    
    // Drop the new-style table and rename the old-style one back
    await pool.query(`
      DROP TABLE medical_records;
      ALTER TABLE medical_records_old RENAME TO medical_records;
    `);
    
    // Add original foreign keys
    await pool.query(`
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_patient_id_fkey
      FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE;
      
      ALTER TABLE medical_records
      ADD CONSTRAINT medical_records_provider_id_fkey
      FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE;
    `);
    
    // Commit the transaction
    await pool.query('COMMIT');
    console.log("Medical records schema reverted successfully");
    
  } catch (error) {
    // Rollback on error
    await pool.query('ROLLBACK');
    console.error("Rollback failed:", error);
    throw error;
  }
}

// Execute the migration when this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up().then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  }).catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
}