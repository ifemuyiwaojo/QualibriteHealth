/**
 * Script to unlock all locked patient accounts
 * This script is useful for testing the temporary password generation feature
 */

import { db } from "./db/index.js";
import { users } from "./db/schema.js";
import { eq } from "drizzle-orm";

async function unlockAllAccounts() {
  try {
    // Find locked accounts
    const lockedUsers = await db.select()
      .from(users)
      .where(eq(users.accountLocked, true));

    if (lockedUsers.length === 0) {
      console.log("No locked accounts found.");
      return;
    }

    console.log(`Found ${lockedUsers.length} locked accounts. Unlocking...`);
    
    // Unlock all accounts
    const result = await db.update(users)
      .set({
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        accountLocked: false,
        lockExpiresAt: null
      })
      .where(eq(users.accountLocked, true));
    
    console.log(`Successfully reset locked status for accounts.`);
    
    // List the affected users
    console.log("Unlocked accounts:");
    for (const user of lockedUsers) {
      console.log(`- ${user.email} (${user.role})`);
    }
  } catch (error) {
    console.error("Error unlocking accounts:", error);
  }
}

// Run the script
unlockAllAccounts()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Script failed:", err);
    process.exit(1);
  });