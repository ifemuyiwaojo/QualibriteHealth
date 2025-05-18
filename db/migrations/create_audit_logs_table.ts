import { sql } from "drizzle-orm";
import { db, pool } from "@db";
import { auditLogs } from "@db/schema";

export async function up() {
  try {
    // Check if the table already exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      // Create the audit_logs table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          action TEXT NOT NULL,
          resource_type TEXT NOT NULL,
          resource_id INTEGER NOT NULL,
          details JSONB,
          ip_address TEXT,
          user_agent TEXT,
          timestamp TIMESTAMP DEFAULT NOW()
        );
      `);
      
      console.log("Created audit_logs table");
    } else {
      console.log("audit_logs table already exists");
    }
    
    // Create an index on user_id for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    `);
    
    // Create an index on timestamp for faster sorting/filtering
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
    `);
    
    console.log("Migration successful");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

export async function down() {
  try {
    // Drop the audit_logs table
    await pool.query(`DROP TABLE IF EXISTS audit_logs;`);
    console.log("Dropped audit_logs table");
  } catch (error) {
    console.error("Rollback failed:", error);
    throw error;
  }
}

// Execute the migration immediately when this file is run directly
// For ESM we check if this file is imported or executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up().then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  }).catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
}