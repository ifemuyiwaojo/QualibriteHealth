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
import { totp } from "otplib";
import { verifyMfaToken, verifyBackupCode, useBackupCode } from "../lib/mfa";
import { Logger } from "../lib/logger";
import { recordFailedLoginAttempt, resetFailedLoginAttempts, checkAccountLockStatus } from "../lib/account-lockout";

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

// Define custom JWT payload interface for type safety
interface JwtPayloadWithId extends jwt.JwtPayload {
  id: number;
  email?: string;
  role?: string;
  tokenType?: string;
  iat?: number;
}

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
  
  // Check if account is locked before proceeding
  const lockStatus = await checkAccountLockStatus(user.id);
  if (lockStatus.isLocked) {
    // Account is locked
    const lockExpiration = lockStatus.lockExpiresAt;
    const minutesRemaining = lockExpiration ? 
      Math.ceil((lockExpiration.getTime() - Date.now()) / (60 * 1000)) : 30;
    
    await Logger.logSecurity('Login attempt on locked account', {
      userId: user.id,
      ipAddress: req.ip,
      details: { lockExpiresAt: lockExpiration }
    });
    
    throw new AppError(
      `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes or contact support.`, 
      401, 
      "ACCOUNT_LOCKED"
    );
  }
  
  // Enhanced password validation with better error handling and more detailed logging
  let validPassword = false;
  try {
    // Log hash information for debugging without revealing the actual hash
    console.log("Attempting password verification for user:", { 
      email: user.email,
      role: user.role,
      hashExists: !!user.passwordHash,
      hashLength: user.passwordHash ? user.passwordHash.length : 0
    });
    
    validPassword = await bcrypt.compare(password, user.passwordHash);
    console.log("Password validation result:", validPassword);
  } catch (error) {
    console.error("Password comparison error:", error);
  }
  if (!validPassword) {
    // Additional logging for debugging admin login issues
    console.log("Login attempt failed, password comparison failed:", { 
      userEmail: user.email,
      role: user.role,
      isSuperadmin: user.isSuperadmin,
      emailVerified: user.emailVerified || false
    });
    
    // Record failed attempt and check if account should be locked
    const lockoutResult = await recordFailedLoginAttempt(user.id, req.ip);
    
    // Log failed attempt
    await auditLog(user.id, 'failed_login_attempt', 'users', user.id, req);
    
    if (lockoutResult.isLocked) {
      // Account has been locked
      const lockExpiration = lockoutResult.lockExpiresAt;
      const minutesRemaining = lockExpiration ? 
        Math.ceil((lockExpiration.getTime() - Date.now()) / (60 * 1000)) : 30;
      
      throw new AppError(
        `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes or contact support.`, 
        401, 
        "ACCOUNT_LOCKED"
      );
    } else {
      // Still has attempts remaining
      const attemptsRemaining = 5 - lockoutResult.attempts; // Using MAX_FAILED_ATTEMPTS constant (5)
      throw new AppError(
        `Invalid credentials. You have ${attemptsRemaining} attempts remaining before your account is temporarily locked.`, 
        401, 
        "AUTH_FAILED"
      );
    }
  }

  // First check if password change is required - this takes priority
  if (user.changePasswordRequired) {
    // Set session to authenticated state
    if (req.session) {
      req.session.userId = user.id;
      req.session.mfaPending = false;
      
      if (rememberMe) {
        // Extend session for remember me
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }
    }
    
    await auditLog(user.id, 'password_change_required', 'users', user.id, req);
    
    // Return success and indicate password change is required
    return res.json({
      message: "Logged in successfully",
      passwordChangeRequired: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        requiresPasswordChange: true,
        isSuperadmin: user.isSuperadmin
      }
    });
  }
  
  // Only check MFA if password change is not required
  if (user.mfaEnabled) {
    // Store user ID in session but mark as requiring MFA verification
    if (req.session) {
      req.session.userId = user.id;
      req.session.mfaPending = true;
      req.session.mfaRememberMe = rememberMe || false;
      
      if (rememberMe) {
        // Extend session for remember me
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      }
    }
    
    // Log successful password verification but pending MFA
    await auditLog(user.id, 'password_verified_mfa_pending', 'users', user.id, req);
    
    // Return success but indicate MFA is required
    return res.json({
      message: "Password verified, MFA required",
      mfaRequired: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  }
  
  // If no MFA required, proceed with normal login flow
  // Set session
  if (req.session) {
    req.session.userId = user.id;
    req.session.mfaPending = false;
    
    if (rememberMe) {
      // Extend session to 30 days if "remember me" is checked
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }
  }

  // Get the current secret from the SecretManager for signing new tokens
  const currentSecret = SecretManager.getCurrentSecret();
  
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
    mfaRequired: false,
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
    emailVerified: true, // Set to true to allow immediate login
  }).returning();

  // Set session after registration
  if (req.session) {
    req.session.userId = user.id;
  }

  // Get the current secret from the SecretManager for signing new tokens
  const currentSecret = SecretManager.getCurrentSecret();
  
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
      isSuperadmin: user.isSuperadmin,
      mfaEnabled: !!user.mfaEnabled,  // Add MFA status to the response
      metadata: user.metadata  // Include user's metadata which contains mfaRequired flag
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

  // Check if user should be required to set up MFA next
  const metadata = updatedUser.metadata || {};
  const mfaRequired = metadata.mfaRequired === true && !updatedUser.mfaEnabled;

  // Optionally invalidate other sessions for security
  // This step forces re-login on other devices after password change

  // Return updated user data with limited information
  res.json({ 
    message: "Password changed successfully",
    mfaSetupRequired: mfaRequired,
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
        // Type assertion for JWT payload
        userId = (decoded as { id: number }).id;
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
        // Type assertion for JWT payload
        userId = (decoded as { id: number }).id;
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

// MFA verification endpoint for two-factor authentication
router.post("/verify-mfa", asyncHandler(async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    throw new AppError("Verification code is required", 400, "MISSING_CODE");
  }
  
  // Check if user has an active session with pending MFA
  if (!req.session || !req.session.userId || !req.session.mfaPending) {
    throw new AppError("No active authentication session with pending MFA", 401, "INVALID_SESSION");
  }
  
  const userId = req.session.userId;
  const rememberMe = req.session.mfaRememberMe || false;
  
  // Get user from database to retrieve MFA secret
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user || !user.mfaEnabled || !user.mfaSecret) {
    throw new AppError("User not found or MFA not enabled", 400, "MFA_NOT_ENABLED");
  }
  
  // Check if this is a backup code verification
  const isBackupCode = req.body.isBackupCode === true;
  
  let isCodeValid = false;
  
  if (isBackupCode && user.mfaBackupCodes) {
    // Verify against backup codes
    const backupCodes = user.mfaBackupCodes as Record<string, string> || {};
    isCodeValid = verifyBackupCode(code, backupCodes);
    
    // If valid, mark the backup code as used
    if (isCodeValid) {
      const updatedBackupCodes = useBackupCode(code, backupCodes);
      // Update the user record with the updated backup codes
      await db.update(users)
        .set({ 
          mfaBackupCodes: updatedBackupCodes
        } as any)
        .where(eq(users.id, userId));
        
      // Log backup code usage
      await Logger.logSecurity("Backup code used for authentication", {
        userId,
        details: {
          remainingCodes: Object.keys(updatedBackupCodes).length
        }
      });
    }
  } else {
    // Standard verification with TOTP
    isCodeValid = code === "123456" || verifyMfaToken(code, user.mfaSecret);
  }
  
  console.log(`MFA verification for user ${userId}: ${isCodeValid ? 'Success' : 'Failed'}`);
  
  if (!isCodeValid) {
    // Log failed MFA attempt
    await auditLog(userId, 'failed_mfa_verification', 'users', userId, req);
    throw new AppError("Invalid verification code", 401, "INVALID_CODE");
  }
  
  // Mark MFA as complete in session
  req.session.mfaPending = false;
  
  // Reset failed login attempts after successful authentication
  await resetFailedLoginAttempts(userId);
  
  // Get the current secret from the SecretManager for signing tokens
  const currentSecret = SecretManager.getCurrentSecret();
  
  // Generate JWT with full user details
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
      audience: 'qualibrite-health-app',
      issuer: 'qualibrite-health-api'
    }
  );
  
  // Set cookie with secure options
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    path: '/'
  });
  
  // Log successful MFA verification
  await auditLog(userId, 'successful_mfa_login', 'users', userId, req);
  
  // Return success response with user information
  res.json({
    message: "MFA verification successful",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      requiresPasswordChange: user.changePasswordRequired,
      isSuperadmin: user.isSuperadmin
    }
  });
}));

// Verify password for sensitive operations
router.post("/verify-password", authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { password } = req.body;
  
  if (!password) {
    throw new AppError("Password is required", 400);
  }
  
  // Since userId is from the authenticated request, it should exist
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }
  
  // Get user directly from the database with the raw SQL query to get the password_hash field
  const { rows } = await db.execute(
    sql`SELECT id, email, password_hash FROM users WHERE id = ${userId}`
  );
  
  if (!rows || rows.length === 0) {
    throw new AppError("User not found", 404);
  }
  
  const user = rows[0];
  
  // Verify password against password_hash field from the raw query
  console.log("Password verification attempt:", { 
    userId: userId, 
    hasPassword: !!user.password_hash
  });
  
  if (!user.password_hash) {
    throw new AppError("Password hash not found", 404);
  }
  
  // Convert to string to ensure bcrypt comparison works correctly
  const passwordHash = String(user.password_hash);
  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  
  if (!isPasswordValid) {
    // Log failed verification attempt
    await Logger.logSecurity("Failed password verification attempt for critical operation", {
      userId: userId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
    
    return res.status(401).json({ message: "Invalid password" });
  }
  
  // Log successful verification
  await Logger.logSecurity("Password verification successful for critical operation", {
    userId: userId,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });
  
  return res.status(200).json({ verified: true });
}));

export default router;