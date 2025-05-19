/**
 * Migration to enhance audit logs table for Phase 4 Security Improvements
 * 
 * This migration adds additional fields to the audit_logs table to support
 * comprehensive security auditing with severity levels, event types, and
 * improved categorization for security events.
 */

import { db } from '../index';
import { sql } from 'drizzle-orm';

export async function up() {
  console.log('Running enhanced audit logs migration...');
  
  try {
    // Add new columns to the audit_logs table
    await db.execute(sql`
      -- Change action to eventType for better semantics
      ALTER TABLE audit_logs RENAME COLUMN action TO event_type;
      
      -- Add severity level column
      ALTER TABLE audit_logs ADD COLUMN severity TEXT NOT NULL DEFAULT 'INFO';
      
      -- Add outcome column
      ALTER TABLE audit_logs ADD COLUMN outcome TEXT;
      
      -- Add session ID column
      ALTER TABLE audit_logs ADD COLUMN session_id TEXT;
      
      -- Add target user ID column (for user management actions)
      ALTER TABLE audit_logs ADD COLUMN target_user_id INTEGER REFERENCES users(id);
      
      -- Make resourceId column optional by allowing NULL values
      ALTER TABLE audit_logs ALTER COLUMN resource_id DROP NOT NULL;
      
      -- Make resourceType column optional by allowing NULL values
      ALTER TABLE audit_logs ALTER COLUMN resource_type DROP NOT NULL;
      
      -- Add message column for human-readable descriptions
      ALTER TABLE audit_logs ADD COLUMN message TEXT NOT NULL DEFAULT '';
      
      -- Create index for faster searches by event type
      CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
      
      -- Create index for faster searches by user ID
      CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
      
      -- Create index for faster searches by timestamp
      CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
      
      -- Create index for faster searches by severity
      CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
    `);
    
    console.log('Successfully enhanced audit logs table');
    return { success: true };
  } catch (error) {
    console.error('Failed to enhance audit logs table:', error);
    throw error;
  }
}

export async function down() {
  console.log('Reverting enhanced audit logs migration...');
  
  try {
    await db.execute(sql`
      -- Revert column rename
      ALTER TABLE audit_logs RENAME COLUMN event_type TO action;
      
      -- Drop added columns
      ALTER TABLE audit_logs DROP COLUMN severity;
      ALTER TABLE audit_logs DROP COLUMN outcome;
      ALTER TABLE audit_logs DROP COLUMN session_id;
      ALTER TABLE audit_logs DROP COLUMN target_user_id;
      ALTER TABLE audit_logs DROP COLUMN message;
      
      -- Restore NOT NULL constraints
      ALTER TABLE audit_logs ALTER COLUMN resource_id SET NOT NULL;
      ALTER TABLE audit_logs ALTER COLUMN resource_type SET NOT NULL;
      
      -- Drop indexes
      DROP INDEX IF EXISTS idx_audit_logs_event_type;
      DROP INDEX IF EXISTS idx_audit_logs_user_id;
      DROP INDEX IF EXISTS idx_audit_logs_timestamp;
      DROP INDEX IF EXISTS idx_audit_logs_severity;
    `);
    
    console.log('Successfully reverted audit logs enhancements');
    return { success: true };
  } catch (error) {
    console.error('Failed to revert audit logs enhancements:', error);
    throw error;
  }
}