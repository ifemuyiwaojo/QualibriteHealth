import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@db";
import { users, auditLogs, insertUserSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken, authorizeRoles } from "../middleware/auth";

const router = Router();

// JWT_SECRET is validated in middleware/auth.ts
// We ensure it's defined here for type safety
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined");
}
const JWT_SECRET = process.env.JWT_SECRET;

// Audit logging middleware
const auditLog = async (userId: number, action: string, resourceType: string, resourceId: number, req: any) => {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      resourceType,
      resourceId,
      details: {
        method: req.method,
        path: req.path,
        body: req.body
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};

// Set temporary password for superadmin
const initializeSuperadmin = async () => {
  const tempPassword = "Admin2024!@QBH";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Check if superadmin exists
  const existingSuperadmin = await db.query.users.findFirst({
    where: eq(users.email, 'superadmin@qualibritehealth.com'),
  });

  if (!existingSuperadmin) {
    // Create superadmin if doesn't exist
    await db.insert(users).values({
      email: 'superadmin@qualibritehealth.com',
      passwordHash: hashedPassword,
      role: 'admin',
      isSuperadmin: true,
      changePasswordRequired: true,
    });
  } else {
    // Update existing superadmin
    await db.update(users)
      .set({
        passwordHash: hashedPassword,
        changePasswordRequired: true,
        isSuperadmin: true,
        role: 'admin'
      })
      .where(eq(users.email, 'superadmin@qualibritehealth.com'));
  }
};

// Initialize superadmin on module load
initializeSuperadmin().catch(console.error);

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      // Log failed attempt
      await auditLog(user.id, 'failed_login_attempt', 'users', user.id, req);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set session
    if (req.session) {
      req.session.userId = user.id;
      if (rememberMe) {
        // Extend session to 30 days if "remember me" is checked
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }
    }

    // Also set JWT token for API requests
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: rememberMe ? "30d" : "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    });

    // Log successful login
    await auditLog(user.id, 'successful_login', 'users', user.id, req);

    res.json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        requiresPasswordChange: user.changePasswordRequired,
        isSuperadmin: user.isSuperadmin
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: "Login failed" });
  }
});

// Register endpoint
router.post("/register", async (req, res) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(validatedData.passwordHash)) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters"
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.passwordHash, 10);
    const [user] = await db.insert(users).values({
      ...validatedData,
      passwordHash: hashedPassword,
    }).returning();

    // Set session after registration
    if (req.session) {
      req.session.userId = user.id;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await auditLog(user.id, 'user_registration', 'users', user.id, req);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(400).json({ 
      message: error.message || "Registration failed" 
    });
  }
});

// Get current user
router.get("/me", authenticateToken, async (req: any, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.id),
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      requiresPasswordChange: user.changePasswordRequired,
      isSuperadmin: user.isSuperadmin
    }
  });
});

// Create admin user (superadmin only)
router.post("/create-admin", authenticateToken, authorizeRoles("admin"), async (req: any, res) => {
  try {
    // Check if the requesting user is a superadmin
    const requestingUser = await db.query.users.findFirst({
      where: eq(users.id, req.user.id),
    });

    if (!requestingUser?.isSuperadmin) {
      return res.status(403).json({ 
        message: "Only superadmins can create new admin users" 
      });
    }

    const { email } = req.body;
    const temporaryPassword = `Admin${Math.random().toString(36).slice(2)}#${new Date().getFullYear()}`;
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const [newAdmin] = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      role: 'admin',
      changePasswordRequired: true, // Ensure password change is required
      isSuperadmin: false,
    }).returning();

    await auditLog(req.user.id, 'admin_user_creation', 'users', newAdmin.id, req);

    res.status(201).json({
      message: "Admin user created successfully",
      temporaryPassword, // This will be shown only once to the superadmin
      admin: { 
        id: newAdmin.id, 
        email: newAdmin.email, 
        role: newAdmin.role,
        requiresPasswordChange: newAdmin.changePasswordRequired,
      },
    });
  } catch (error: any) {
    console.error("Admin creation error:", error);
    res.status(400).json({ 
      message: error.message || "Failed to create admin user" 
    });
  }
});

// Change password (required for first login)
router.post("/change-password", authenticateToken, async (req: any, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user.id),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "New password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [updatedUser] = await db
      .update(users)
      .set({ 
        passwordHash: hashedPassword,
        changePasswordRequired: false 
      })
      .where(eq(users.id, req.user.id))
      .returning();

    await auditLog(req.user.id, 'password_change', 'users', req.user.id, req);

    // Return updated user data
    res.json({ 
      message: "Password changed successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        requiresPasswordChange: updatedUser.changePasswordRequired,
        isSuperadmin: updatedUser.isSuperadmin
      }
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(400).json({ message: "Failed to change password" });
  }
});


// Logout endpoint
router.post("/logout", authenticateToken, async (req: any, res) => {
  if (req.user) {
    await auditLog(req.user.id, 'logout', 'users', req.user.id, req);
  }

  // Clear both the JWT cookie and session
  res.clearCookie("token");

  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "Logged out successfully" });
  }
});

export default router;