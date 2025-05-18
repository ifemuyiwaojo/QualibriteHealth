// Add account lockout columns to users table

import { pool } from '../db/index.js';

async function addAccountLockoutColumns() {
  console.log('Starting to add account lockout columns...');
  
  try {
    const client = await pool.connect();
    
    try {
      console.log('Adding columns for account lockout functionality...');
      
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP,
        ADD COLUMN IF NOT EXISTS account_locked BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS lock_expires_at TIMESTAMP;
      `);
      
      console.log('✅ Successfully added account lockout columns');
    } finally {
      client.release();
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
addAccountLockoutColumns();