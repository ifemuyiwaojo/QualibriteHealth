/**
 * Script to reset passwords for all user accounts to "Password123!"
 * Uses bcrypt with salt factor 12 (matching app config)
 * Also unlocks any locked accounts and resets failed login attempts
 */
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";

const EMAILS = [
  // Patients
  "sarah.smith@example.com",
  "james.wilson@example.com",
  "emily.jones@example.com",
  "michael.brown@example.com",
  "patient1@example.com",
  "patient2@example.com",
  "patient3@example.com",
  "patient4@example.com",
  "patient5@example.com",
  // Provider
  "dr.smith@qualibrite.com",
  // Admins
  "admin@qualibritehealth.com",
  "lisa.davis@example.com",
  "superadmin@qualibritehealth.com",
  // Practice Manager
  "manager@qualibrite.com",
  // Billing
  "billing@qualibrite.com",
  // Intake Coordinator
  "trip007@gmail.com",
  // IT Support
  "support@qualibrite.com",
  // Marketing
  "marketing@qualibrite.com",
];

const resetAllPasswords = async () => {
  const password = "Password123!";
  const passwordHash = await bcrypt.hash(password, 12);

  console.log(`Resetting passwords for ${EMAILS.length} users...\n`);

  let updated = 0;
  let notFound = 0;

  for (const email of EMAILS) {
    const [user] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      console.log(`  NOT FOUND: ${email}`);
      notFound++;
      continue;
    }

    await db
      .update(users)
      .set({
        passwordHash,
        changePasswordRequired: false,
        failedLoginAttempts: 0,
        accountLocked: false,
        lockExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    console.log(`  UPDATED: ${email}`);
    updated++;
  }

  console.log(`\nDone! ${updated} updated, ${notFound} not found.`);
  console.log(`Password for all updated accounts: ${password}`);
};

resetAllPasswords()
  .catch((err) => {
    console.error("Error resetting passwords:", err);
  })
  .finally(() => {
    process.exit(0);
  });
