/**
 * Seed script to create all user accounts in the database.
 * Run with: DATABASE_URL=... npx tsx server/seed-users.js
 */
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { users } from "../db/schema.js";
import bcrypt from "bcryptjs";

const PASSWORD = "Password123!";

const USERS = [
  // Patients
  { email: "sarah.smith@example.com", role: "patient", metadata: { firstName: "Sarah", lastName: "Smith" } },
  { email: "james.wilson@example.com", role: "patient", metadata: { firstName: "James", lastName: "Wilson" } },
  { email: "emily.jones@example.com", role: "patient", metadata: { firstName: "Emily", lastName: "Jones" } },
  { email: "michael.brown@example.com", role: "patient", metadata: { firstName: "Michael", lastName: "Brown" } },
  { email: "patient1@example.com", role: "patient", metadata: { firstName: "Patient", lastName: "One" } },
  { email: "patient2@example.com", role: "patient", metadata: { firstName: "Patient", lastName: "Two" } },
  { email: "patient3@example.com", role: "patient", metadata: { firstName: "Patient", lastName: "Three" } },
  { email: "patient4@example.com", role: "patient", metadata: { firstName: "Patient", lastName: "Four" } },
  { email: "patient5@example.com", role: "patient", metadata: { firstName: "Patient", lastName: "Five" } },
  // Provider
  { email: "dr.smith@qualibrite.com", role: "provider", metadata: { firstName: "Dr.", lastName: "Smith" } },
  // Admins
  { email: "admin@qualibritehealth.com", role: "admin", metadata: { firstName: "Admin", lastName: "User" } },
  { email: "lisa.davis@example.com", role: "admin", metadata: { firstName: "Lisa", lastName: "Davis" } },
  { email: "superadmin@qualibritehealth.com", role: "admin", isSuperadmin: true, metadata: { firstName: "Super", lastName: "Admin" } },
  // Practice Manager
  { email: "manager@qualibrite.com", role: "practice_manager", metadata: { firstName: "Practice", lastName: "Manager" } },
  // Billing
  { email: "billing@qualibrite.com", role: "billing", metadata: { firstName: "Billing", lastName: "Staff" } },
  // Intake Coordinator
  { email: "trip007@gmail.com", role: "intake_coordinator", metadata: { firstName: "Trip", lastName: "Coordinator" } },
  // IT Support
  { email: "support@qualibrite.com", role: "it_support", metadata: { firstName: "IT", lastName: "Support" } },
  // Marketing
  { email: "marketing@qualibrite.com", role: "marketing", metadata: { firstName: "Marketing", lastName: "Team" } },
];

const seedUsers = async () => {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  console.log(`Seeding ${USERS.length} users with password: ${PASSWORD}\n`);

  let created = 0;
  let skipped = 0;

  for (const userData of USERS) {
    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existing) {
      // Update the password hash for existing users
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
        .where(eq(users.id, existing.id));
      console.log(`  UPDATED: ${userData.email} (already existed)`);
      skipped++;
      continue;
    }

    await db.insert(users).values({
      email: userData.email,
      passwordHash,
      role: userData.role,
      isSuperadmin: userData.isSuperadmin || false,
      metadata: userData.metadata || {},
      changePasswordRequired: false,
      failedLoginAttempts: 0,
      accountLocked: false,
    });
    console.log(`  CREATED: ${userData.email} (${userData.role})`);
    created++;
  }

  console.log(`\nDone! ${created} created, ${skipped} updated.`);
  console.log(`Password for all accounts: ${PASSWORD}`);
};

seedUsers()
  .catch((err) => {
    console.error("Error seeding users:", err);
  })
  .finally(() => {
    process.exit(0);
  });
