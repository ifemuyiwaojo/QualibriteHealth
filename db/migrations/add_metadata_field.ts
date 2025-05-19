/**
 * Migration to add metadata field to users table
 * This adds a JSON field to store additional user information like name and phone
 */

import { sql } from "drizzle-orm";
import { db, pool } from "../index";

export async function up() {
  // Check if the column already exists
  const result = await pool.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'metadata'
  `);
  
  // Only add the column if it doesn't already exist
  if (result.rows.length === 0) {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN metadata JSONB DEFAULT '{}' NOT NULL
    `);
    
    console.log('✅ Added metadata column to users table');
  } else {
    console.log('✅ Metadata column already exists in users table');
  }
}

export async function down() {
  await pool.query(`
    ALTER TABLE users
    DROP COLUMN IF EXISTS metadata
  `);
  
  console.log('✅ Removed metadata column from users table');
}