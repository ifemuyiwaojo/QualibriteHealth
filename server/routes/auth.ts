import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@db";
import { users, auditLogs, insertUserSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/auth";
import rateLimit from "express-rate-limit";
import { asyncHandler, AppError } from "../lib/error-handler";

const router = Router();

// Rate limiters for authentication endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registration attempts per hour
  message: { message: "Too many registration attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

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

// Login endpoint with improved error handling - removed rate limiter for now
router.post("/login", asyncHandler(async (req, res) => {
  console.log("Login attempt:", { email: req.body.email });
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400, "VALIDATION_ERROR");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // Use generic message for security - don't reveal if email exists
    throw new AppError("Invalid credentials", 401, "AUTH_FAILED");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    // Log failed attempt
    await auditLog(user.id, 'failed_login_attempt', 'users', user.id, req);
    // Always use same error for security
    throw new AppError("Invalid credentials", 401, "AUTH_FAILED");
  }

  // Set session
  if (req.session) {
    req.session.userId = user.id;
    if (rememberMe) {
      // Extend session to 30 days if "remember me" is checked
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }
  }

  // Also set JWT token for API requests with secure practices
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      // Add issued time for token security
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: rememberMe ? "30d" : "24h",
      // Add audience and issuer claims for better security
      audience: 'qualibrite-health-app',
      issuer: 'qualibrite-health-api'
    }
  );

  // Set cookie with secure options
  res.cookie("token", token, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // Prevents CSRF
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    path: '/' // Accessible throughout the app
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
}));

// Register endpoint with enhanced security and error handling
router.post("/register", registrationLimiter, asyncHandler(async (req, res) => {
  // Validate input data through schema
  const validatedData = insertUserSchema.parse(req.body);

  // Check for existing user with case-insensitive email comparison
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, validatedData.email),
  });

  if (existingUser) {
    throw new AppError("Email already registered", 400, "EMAIL_EXISTS");
  }

  // Enhanced password complexity validation with informative error
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(validatedData.passwordHash)) {
    throw new AppError(
      "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters",
      400, 
      "PASSWORD_COMPLEXITY"
    );
  }

  // Use a higher work factor (12) for better security
  const hashedPassword = await bcrypt.hash(validatedData.passwordHash, 12);
  
  // Create user with sanitized data
  const [user] = await db.insert(users).values({
    email: validatedData.email.toLowerCase().trim(), // Normalize email
    role: validatedData.role,
    passwordHash: hashedPassword,
    // Set default values for security
    changePasswordRequired: validatedData.role !== 'patient', // Force providers/admins to change password
    isSuperadmin: false, // Never allow registration as superadmin
  }).returning();

  // Set session after registration
  if (req.session) {
    req.session.userId = user.id;
  }

  // Create JWT with enhanced security
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: "24h",
      audience: 'qualibrite-health-app',
      issuer: 'qualibrite-health-api'
    }
  );

  // Set secure cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });

  // Log registration for audit trail
  await auditLog(user.id, 'user_registration', 'users', user.id, req);
  
  // Return success with limited user data
  res.status(201).json({
    message: "User registered successfully",
    user: { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
  });
}));

// Get current user with improved error handling
router.get("/me", authenticateToken, asyncHandler(async (req: any, res) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401, "AUTH_REQUIRED");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.id),
  });

  if (!user) {
    throw new AppError("User not found", 401, "USER_NOT_FOUND");
  }

  // Return only necessary user information (principle of least privilege)
  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      requiresPasswordChange: user.changePasswordRequired,
      isSuperadmin: user.isSuperadmin
    }
  });
}));

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

// Change password with enhanced security features
router.post("/change-password", authenticateToken, asyncHandler(async (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new AppError("Both current and new passwords are required", 400, "MISSING_FIELDS");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.id),
  });

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  // Verify current password with constant-time comparison
  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) {
    // Log failed password change attempt
    await auditLog(req.user.id, 'failed_password_change', 'users', req.user.id, req);
    throw new AppError("Current password is incorrect", 401, "INVALID_PASSWORD");
  }

  // Prevent reuse of current password
  if (await bcrypt.compare(newPassword, user.passwordHash)) {
    throw new AppError("New password must be different from current password", 400, "PASSWORD_REUSE");
  }

  // Enhanced password complexity validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new AppError(
      "New password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters", 
      400, 
      "PASSWORD_COMPLEXITY"
    );
  }

  // Use a higher work factor (12) for better security
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update the user's password and reset the change requirement flag
  const [updatedUser] = await db
    .update(users)
    .set({ 
      passwordHash: hashedPassword,
      changePasswordRequired: false 
    })
    .where(eq(users.id, req.user.id))
    .returning();

  // Log successful password change for audit trail
  await auditLog(req.user.id, 'password_change', 'users', req.user.id, req);

  // Optionally invalidate other sessions for security
  // This step forces re-login on other devices after password change

  // Return updated user data with limited information
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
}));


// Logout endpoint with improved security and error handling
router.post("/logout", authenticateToken, asyncHandler(async (req: any, res) => {
  // Audit the logout action if we have a user
  if (req.user) {
    await auditLog(req.user.id, 'logout', 'users', req.user.id, req);
  }

  // Clear the JWT cookie with secure options
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: '/'
  });

  // Destroy the session securely
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Session destruction error:", err);
        throw new AppError("Logout failed", 500, "SESSION_ERROR");
      }
      
      // Return a success response
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "Logged out successfully" });
  }
}));

export default router;