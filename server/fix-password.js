// Simple script to reset Lisa Davis's password to Password123!
import bcrypt from 'bcryptjs';
import { pool } from '../db/index.js';

async function resetPassword() {
  try {
    console.log("Resetting password for Lisa Davis...");
    
    // Default password
    const defaultPassword = "Password123!";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    
    // Direct database update using query
    const result = await pool.query(
      `UPDATE users 
       SET password_hash = $1, 
           change_password_required = TRUE,
           failed_login_attempts = 0,
           account_locked = FALSE,
           lock_expires_at = NULL
       WHERE email = $2
       RETURNING id, email`,
      [passwordHash, "lisa.davis@example.com"]
    );
    
    if (result.rows && result.rows.length > 0) {
      console.log(`Password reset successful for user: ${result.rows[0].email} (ID: ${result.rows[0].id})`);
      console.log(`New password: ${defaultPassword}`);
      console.log("User will be required to change password on next login.");
    } else {
      console.log("User lisa.davis@example.com not found!");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    // Close the database connection
    await pool.end();
    process.exit(0);
  }
}

// Run the script
resetPassword();