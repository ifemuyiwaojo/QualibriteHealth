import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@db";
import { users, auditLogs, insertUserSchema } from "@db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

// Get current user with enhanced security
router.get("/me", authenticateToken, async (req: any, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  await auditLog(req.user.id, 'user_check', 'users', req.user.id, req);
  res.json({ user: req.user });
});

// Register new user with enhanced security and audit
router.post("/register", async (req, res) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);

    // For admin registration, require a special token
    if (validatedData.role === 'admin' && req.headers['x-admin-token'] !== process.env.ADMIN_REGISTRATION_TOKEN) {
      return res.status(403).json({ message: "Unauthorized admin registration attempt" });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(validatedData.passwordHash, 10);
    const [user] = await db.insert(users).values({
      ...validatedData,
      passwordHash: hashedPassword,
    }).returning();

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Log the registration
    await auditLog(user.id, 'user_registration', 'users', user.id, req);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: "Invalid registration data" });
  }
});

// Login with enhanced security and audit
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      // Log failed login attempt
      await auditLog(user.id, 'failed_login_attempt', 'users', user.id, req);
      return res.status(401).json({ message: "Invalid credentials" });
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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Log successful login
    await auditLog(user.id, 'successful_login', 'users', user.id, req);

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Logged in successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: "Login failed" });
  }
});

// Logout with audit
router.post("/logout", authenticateToken, async (req: any, res) => {
  if (req.user) {
    await auditLog(req.user.id, 'logout', 'users', req.user.id, req);
  }
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

export default router;