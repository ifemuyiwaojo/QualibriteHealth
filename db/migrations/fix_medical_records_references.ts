import { pool } from "@db";

export async function up() {
  try {
    // Check if the medical_records table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'medical_records'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log("medical_records table doesn't exist, no need to update references");
      return;
    }
    
    // First, check if the references need updating
    const columnRefs = await pool.query(`
      SELECT 
        kcu.column_name, 
        ccu.table_name 
      FROM 
        information_schema.constraint_column_usage AS ccu
        JOIN information_schema.table_constraints AS tc
          ON tc.constraint_name = ccu.constraint_name
        JOIN information_schema.key_column_usage AS kcu
          ON kcu.constraint_name = tc.constraint_name
      WHERE 
        kcu.table_name = 'medical_records' AND 
        kcu.column_name IN ('patient_id', 'provider_id') AND
        tc.constraint_type = 'FOREIGN KEY';
    `);
    
    const needsUpdate = columnRefs.rows.some(row => row.table_name === 'users');
    
    if (!needsUpdate) {
      console.log("References already correctly set up, no updates needed");
      return;
    }
    
    // Start a transaction for safety
    await pool.query('BEGIN');
    
    // Drop the existing foreign key constraints before updating them
    await pool.query(`
      ALTER TABLE medical_records 
      DROP CONSTRAINT IF EXISTS medical_records_patient_id_fkey,
      DROP CONSTRAINT IF EXISTS medical_records_provider_id_fkey;
    `);
    
    // Create a temporary table to hold the data
    await pool.query(`
      CREATE TABLE medical_records_temp (
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
    
    // Copy data to temporary table
    await pool.query(`
      INSERT INTO medical_records_temp
      SELECT * FROM medical_records;
    `);
    
    // Drop original table
    await pool.query(`
      DROP TABLE medical_records;
    `);
    
    // Create new table with correct references
    await pool.query(`
      CREATE TABLE medical_records (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES patient_profiles(id),
        provider_id INTEGER NOT NULL REFERENCES provider_profiles(id),
        type VARCHAR(50) NOT NULL,
        visit_date TIMESTAMP NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Copy data back
    await pool.query(`
      INSERT INTO medical_records
      SELECT * FROM medical_records_temp;
    `);
    
    // Drop temporary table
    await pool.query(`
      DROP TABLE medical_records_temp;
    `);
    
    // Create indexes for the foreign keys for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON medical_records(patient_id);
      CREATE INDEX IF NOT EXISTS idx_medical_records_provider_id ON medical_records(provider_id);
    `);
    
    await pool.query('COMMIT');
    console.log("Medical records references fixed successfully");
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error("Migration failed:", error);
    throw error;
  }
}

export async function down() {
  try {
    // Revert back to original references
    await pool.query('BEGIN');
    
    // Drop the modified foreign key constraints
    await pool.query(`
      ALTER TABLE medical_records 
      DROP CONSTRAINT IF EXISTS medical_records_patient_id_fkey,
      DROP CONSTRAINT IF EXISTS medical_records_provider_id_fkey;
    `);
    
    // Create temporary table
    await pool.query(`
      CREATE TABLE medical_records_temp (
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
    
    // Copy data to temporary table
    await pool.query(`
      INSERT INTO medical_records_temp
      SELECT * FROM medical_records;
    `);
    
    // Drop modified table
    await pool.query(`
      DROP TABLE medical_records;
    `);
    
    // Recreate original table with original references
    await pool.query(`
      CREATE TABLE medical_records (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL REFERENCES users(id),
        provider_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        visit_date TIMESTAMP NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Copy data back
    await pool.query(`
      INSERT INTO medical_records
      SELECT * FROM medical_records_temp;
    `);
    
    // Drop temporary table
    await pool.query(`
      DROP TABLE medical_records_temp;
    `);
    
    await pool.query('COMMIT');
    console.log("Medical records references reverted successfully");
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Rollback failed:", error);
    throw error;
  }
}

// Execute the migration immediately when this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up().then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  }).catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
}