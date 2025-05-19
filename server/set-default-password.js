/**
 * Script to set Lisa Davis's password to "Password123!" 
 * and require it to be changed on first login
 */
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";

// Use ES Module syntax for the whole file
const setDefaultPassword = async () => {
  try {
    console.log("Setting default password for Lisa Davis...");
    
    // Default password for Lisa Davis
    const defaultPassword = "Password123!";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    
    // Find Lisa Davis by email
    const [lisaDavis] = await db
      .select()
      .from(users)
      .where(eq(users.email, "lisa.davis@example.com"))
      .limit(1);
      
    if (!lisaDavis) {
      console.error("User lisa.davis@example.com not found!");
      return;
    }
    
    console.log(`Updating password for user ID: ${lisaDavis.id}`);
    
    // Update the password and set password change required
    await db
      .update(users)
      .set({
        passwordHash: passwordHash,
        changePasswordRequired: true,
        // Reset account lockout if locked
        failedLoginAttempts: 0,
        accountLocked: false,
        lockExpiresAt: null
      })
      .where(eq(users.id, lisaDavis.id));
    
    console.log("Password updated successfully!");
    console.log(`Username: lisa.davis@example.com`);
    console.log(`Password: ${defaultPassword}`);
    console.log("User will be required to change password on next login.");
    
  } catch (error) {
    console.error("Error setting default password:", error);
  } finally {
    process.exit(0);
  }
}

// Immediately invoke the function
setDefaultPassword();