/**
 * Script to run the account lockout migration
 * 
 * This script adds the necessary columns to the users table for 
 * implementing account lockout functionality.
 */

import { sql } from 'drizzle-orm';
import { pool } from '../db/index.js';

async function runMigration() {
  try {
    console.log('Starting account lockout migration...');
    
    // Connect directly to the database
    const client = await pool.connect();
    
    try {
      // Add columns to track failed login attempts and account lockouts
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP,
        ADD COLUMN IF NOT EXISTS account_locked BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS lock_expires_at TIMESTAMP;
      `);
      
      console.log('✅ Successfully added account lockout columns to users table');
    } catch (err) {
      console.error('❌ Migration failed:', err);
      throw err;
    } finally {
      client.release();
    }
    
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed with error:', err);
    process.exit(1);
  }
}

// Run the migration
runMigration();