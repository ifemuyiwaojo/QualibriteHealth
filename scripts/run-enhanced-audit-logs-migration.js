/**
 * Script to run the enhanced audit logs migration
 * 
 * This script applies the Phase 4 security improvements to enhance
 * the audit logging capabilities for better security monitoring and compliance.
 */

import { db } from '../db';
import { up } from '../db/migrations/enhanced_audit_logs';

async function runMigration() {
  console.log('Starting Phase 4 security improvements: Enhanced audit logging');
  
  try {
    const result = await up();
    
    if (result.success) {
      console.log('Successfully applied enhanced audit logs migration');
      console.log('✅ Phase 4 security improvement: Enhanced audit logging complete');
    } else {
      console.error('Failed to apply enhanced audit logs migration');
    }
  } catch (error) {
    console.error('Error running enhanced audit logs migration:', error);
  } finally {
    // Close the database connection
    await db.end();
  }
}

// Run the migration
runMigration().catch(console.error);