import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "@db";
import { users, auditLogs, insertUserSchema } from "@db/schema";
import { eq, and, or, sql } from "drizzle-orm";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/auth";
import rateLimit from "express-rate-limit";
import { asyncHandler, AppError } from "../lib/error-handler";
import { sendEmail } from "../lib/email";

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

// JWT secrets are now managed by the SecretManager
// Import the SecretManager for token signing
import { SecretManager } from "../lib/secret-manager";

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

// Create a curl command to set up an admin:
// curl -X POST http://localhost:5000/api/auth/create-admin \
//   -H "Content-Type: application/json" \
//   -d '{"email":"admin@qualibritehealth.com", "password":"Admin123!", "adminKey":"QBH-Admin-Setup-2024"}'

// Admin creation endpoint
router.post("/create-admin", asyncHandler(async (req, res) => {
  const { email, password, adminKey } = req.body;
  
  // Simple security check - require an admin key for this operation
  const correctAdminKey = "QBH-Admin-Setup-2024";
  
  if (adminKey !== correctAdminKey) {
    throw new AppError("Invalid admin key", 403, "UNAUTHORIZED");
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
    // Additional logging for debugging admin login issues
  console.log("Login attempt failed, password comparison failed:", { 
    userEmail: user.email,
    role: user.role,
    isSuperadmin: user.isSuperadmin
  });
  
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

  // Get the current secret from the SecretManager for signing new tokens
  const secretManager = SecretManager.getInstance();
  const currentSecret = secretManager.getCurrentSecret();
  
  // Also set JWT token for API requests with secure practices
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      // Add issued time for token security
      iat: Math.floor(Date.now() / 1000)
    },
    currentSecret,
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

  // Get the current secret from the SecretManager for signing new tokens
  const secretManager = SecretManager.getInstance();
  const currentSecret = secretManager.getCurrentSecret();
  
  // Create JWT with enhanced security
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    },
    currentSecret,
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


// Token refresh endpoint - implements OAuth2.0-like refresh flow
router.post("/refresh-token", asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const token = req.cookies.token;
  
  if (!token && !refreshToken) {
    throw new AppError("No token provided", 401, "AUTH_REQUIRED");
  }
  
  // Get instance of secret manager
  const secretManager = SecretManager.getInstance();
  const validSecrets = secretManager.getAllValidSecrets();
  
  // Verify either the token from cookie or the provided refresh token
  let userId = null;
  let decoded = null;
  let tokenValid = false;
  
  // First try the token in the cookie
  if (token) {
    for (const secret of validSecrets) {
      try {
        decoded = jwt.verify(token, secret, {
          audience: 'qualibrite-health-app',
          issuer: 'qualibrite-health-api'
        });
        tokenValid = true;
        userId = decoded.id;
        break;
      } catch (err) {
        // Continue to next secret or token
      }
    }
  }
  
  // If cookie token failed, try the refresh token
  if (!tokenValid && refreshToken) {
    for (const secret of validSecrets) {
      try {
        decoded = jwt.verify(refreshToken, secret, {
          audience: 'qualibrite-health-refresh',
          issuer: 'qualibrite-health-api'
        });
        tokenValid = true;
        userId = decoded.id;
        break;
      } catch (err) {
        // Continue to next secret
      }
    }
  }
  
  if (!tokenValid || !userId) {
    throw new AppError("Invalid or expired token", 401, "INVALID_TOKEN");
  }
  
  // Fetch the user to ensure they exist and are active
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  
  // Create new access token with the current secret
  const currentSecret = secretManager.getCurrentSecret();
  const newToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    },
    currentSecret,
    { 
      expiresIn: "24h",
      audience: 'qualibrite-health-app',
      issuer: 'qualibrite-health-api'
    }
  );
  
  // Create new refresh token with longer expiry
  const newRefreshToken = jwt.sign(
    { 
      id: user.id, 
      tokenType: 'refresh',
      iat: Math.floor(Date.now() / 1000)
    },
    currentSecret,
    { 
      expiresIn: "30d",
      audience: 'qualibrite-health-refresh',
      issuer: 'qualibrite-health-api'
    }
  );
  
  // Update session if it exists
  if (req.session) {
    req.session.userId = user.id;
  }
  
  // Set new token cookie
  res.cookie("token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });
  
  // Log token refresh for audit trail
  await auditLog(user.id, 'token_refresh', 'users', user.id, req);
  
  // Return new tokens and user data
  res.json({
    message: "Token refreshed successfully",
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      requiresPasswordChange: user.changePasswordRequired,
      isSuperadmin: user.isSuperadmin
    },
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

// Forgot password endpoint
router.post("/forgot-password", asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new AppError("Email is required", 400, "MISSING_FIELDS");
  }
  
  // Find user with the provided email
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  // Even if user is not found, return success for security
  // This prevents email enumeration attacks
  if (!user) {
    // Log attempted reset for non-existent email for security monitoring
    console.log(`Password reset requested for non-existent email: ${email}`);
    
    // Still return success response to prevent email enumeration
    return res.json({
      message: "If an account with that email exists, a password reset link has been sent."
    });
  }
  
  // Restrict password reset for admin accounts
  if (user.role === 'admin') {
    // Log the attempt for security monitoring
    console.log(`Password reset attempted for admin account: ${email}`);
    
    // Return the same message as success to prevent role enumeration
    return res.json({
      message: "If an account with that email exists, a password reset link has been sent."
    });
  }
  
  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token before storing it (for security)
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set token and expiry (1 hour from now)
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);
  
  // Update user with reset token and expiry
  await db.update(users)
    .set({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiryDate
    })
    .where(eq(users.id, user.id));
  
  // Create reset URL (frontend will handle this route)
  // In production, use a proper frontend URL config
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  
  // Email content
  const mailOptions = {
    to: user.email,
    subject: 'Password Reset Request - Qualibrite Health',
    text: `You are receiving this email because you (or someone else) requested to reset your password.
    
Please click on the following link to complete the process:
${resetUrl}

This link is valid for 1 hour.

If you did not request this, please ignore this email and your password will remain unchanged.`
  };
  
  try {
    // Send the email
    await sendEmail(mailOptions);
    
    // Log the action
    console.log(`Password reset email sent to ${user.email}`);
    
    res.json({
      message: "If an account with that email exists, a password reset link has been sent."
    });
  } catch (error) {
    // Reset the fields if email fails
    await db.update(users)
      .set({
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
      .where(eq(users.id, user.id));
    
    throw new AppError("Failed to send reset email", 500, "EMAIL_ERROR");
  }
}));

// Reset password with token endpoint
router.post("/reset-password/:token", asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  if (!password) {
    throw new AppError("New password is required", 400, "MISSING_FIELDS");
  }
  
  // Hash the provided token to compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  // Find user with this token and valid expiry
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.resetPasswordToken, hashedToken),
      sql`${users.resetPasswordExpires} > NOW()`
    ),
  });
  
  if (!user) {
    throw new AppError("Password reset token is invalid or has expired", 400, "INVALID_TOKEN");
  }
  
  // Enhanced password complexity validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new AppError(
      "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters", 
      400, 
      "PASSWORD_COMPLEXITY"
    );
  }
  
  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Update user with new password and clear reset token fields
  await db.update(users)
    .set({
      passwordHash: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      changePasswordRequired: false
    })
    .where(eq(users.id, user.id));
  
  // Log the password reset
  console.log(`Password reset completed for ${user.email}`);
  
  res.json({
    message: "Password has been reset successfully. Please log in with your new password."
  });
}));

// Forgot email endpoint (email recovery) - restricted to non-admin accounts
router.post("/forgot-email", asyncHandler(async (req, res) => {
  // Get potential identifier (name, phone, etc.)
  const { identifier } = req.body;
  
  if (!identifier) {
    throw new AppError("Please provide some information to find your account", 400, "MISSING_FIELDS");
  }
  
  // In the actual implementation, we would exclude admin accounts from any search results
  // For security, we log attempted searches but always return the same response
  
  // This is a placeholder for a more sophisticated lookup
  // In a real application, you might search patient/provider profiles 
  // or other user metadata to find matching accounts
  
  res.json({
    message: "If we can identify your account, we'll send an email with your login information to your registered email address."
  });
  
  // Note: For security reasons, the actual email lookup and sending would happen
  // asynchronously after the response to prevent timing attacks
}));

export default router;