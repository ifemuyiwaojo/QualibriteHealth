import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { asyncHandler, AppError } from "../lib/error-handler";

const router = Router();

// Create a curl command to set up an admin:
// curl -X POST http://localhost:5000/api/setup/create-admin \
//   -H "Content-Type: application/json" \
//   -d '{"email":"admin@qualibritehealth.com", "password":"Admin123!", "setupKey":"QBH-Setup-2024"}'

// Admin creation endpoint that does NOT require authentication
router.post("/create-admin", asyncHandler(async (req, res) => {
  const { email, password, setupKey } = req.body;
  
  // Simple security check - require a setup key for this operation
  const correctSetupKey = "QBH-Setup-2024";
  
  if (setupKey !== correctSetupKey) {
    throw new AppError("Invalid setup key", 403, "UNAUTHORIZED");
  }
  
  if (!email || !password) {
    throw new AppError("Email and password are required", 400, "MISSING_FIELDS");
  }
  
  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  let adminUser;
  
  if (existingUser) {
    // Update existing user to admin
    [adminUser] = await db.update(users)
      .set({
        passwordHash: hashedPassword,
        role: 'admin',
        isSuperadmin: true,
        changePasswordRequired: false
      })
      .where(eq(users.id, existingUser.id))
      .returning();
      
    console.log("Updated user to admin:", { id: adminUser.id, email: adminUser.email });
  } else {
    // Create new admin user
    [adminUser] = await db.insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
        role: 'admin',
        isSuperadmin: true,
        changePasswordRequired: false
      })
      .returning();
      
    console.log("Created new admin user:", { id: adminUser.id, email });
  }
  
  // Return success message
  res.status(201).json({
    message: "Admin account created successfully",
    user: {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      isSuperadmin: adminUser.isSuperadmin
    }
  });
}));

export default router;