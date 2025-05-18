import { Router } from "express";
import { db } from "@db";
import { users } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken, authorizeRoles, AuthRequest } from "../middleware/auth";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { Logger } from "../lib/logger";

const router = Router();
const scryptAsync = promisify(scrypt);

// Helper function for hashing passwords
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Get all users (admin only)
router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      // Check if user is superadmin or regular admin
      const isSuperadmin = req.user?.isSuperadmin;
      
      // Get all users
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      
      // If not superadmin, filter out other admins and superadmins
      const filteredUsers = isSuperadmin 
        ? allUsers
        : allUsers.filter(user => !(user.role === "admin" && user.id !== req.user?.id) && !user.isSuperadmin);
      
      // Remove sensitive data
      const sanitizedUsers = filteredUsers.map(({ passwordHash, ...user }) => user);
      
      res.json(sanitizedUsers);
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

// Create new user (admin only)
router.post(
  "/users",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      // Validate request body
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
        role: z.string(),
        name: z.string().optional(),
        phone: z.string().optional(),
        isSuperadmin: z.boolean().optional().default(false),
        requirePasswordChange: z.boolean().optional().default(true),
        skipEmailVerification: z.boolean().optional().default(false),
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const { email, password, role, name, phone, isSuperadmin, requirePasswordChange } = result.data;
      
      // Only superadmin can create other superadmins or admins
      if ((isSuperadmin || role === "admin") && !req.user?.isSuperadmin) {
        return res.status(403).json({ 
          message: "Only superadmins can create admin or superadmin accounts" 
        });
      }
      
      // Check if user already exists
      const existingUser = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);
      
      if (existingUser.length > 0) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      // Create the user
      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash: await hashPassword(password),
        role: role as any, // Cast to the enum type
        isSuperadmin: isSuperadmin || false,
        changePasswordRequired: requirePasswordChange || true,
      }).returning();
      
      // Log the creation
      await Logger.logSecurity(`User created by admin: ${newUser.email}`, {
        userId: req.user?.id,
        resourceId: newUser.id,
        resourceType: 'user',
        details: {
          role: newUser.role,
          isSuperadmin: newUser.isSuperadmin,
        }
      });
      
      res.status(201).json(newUser);
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to create user" });
    }
  }
);

// Get user by ID (admin only)
router.get(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Get the user
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if admin can view this user
      if (!req.user?.isSuperadmin && user.role === "admin" && user.id !== req.user?.id) {
        return res.status(403).json({ message: "You don't have permission to view this user" });
      }
      
      // Remove sensitive data
      const { passwordHash, ...userData } = user;
      
      res.json(userData);
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to fetch user" });
    }
  }
);

// Update user (admin only)
router.patch(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Validate request body
      const schema = z.object({
        email: z.string().email().optional(),
        role: z.string().optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
        isActive: z.boolean().optional(),
        isSuperadmin: z.boolean().optional(),
        resetPassword: z.boolean().optional(),
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      // Get the user
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check permissions
      // Only superadmins can modify admin accounts
      if (
        (user.role === "admin" || user.isSuperadmin) && 
        !req.user?.isSuperadmin && 
        user.id !== req.user?.id
      ) {
        return res.status(403).json({ 
          message: "Only superadmins can modify admin accounts" 
        });
      }
      
      // Only superadmins can grant superadmin privileges
      if (result.data.isSuperadmin && !req.user?.isSuperadmin) {
        return res.status(403).json({ 
          message: "Only superadmins can grant superadmin privileges" 
        });
      }
      
      // Prevent changing own role or superadmin status
      if (user.id === req.user?.id) {
        if (result.data.role && result.data.role !== user.role) {
          return res.status(403).json({ message: "Cannot change your own role" });
        }
        
        if (typeof result.data.isSuperadmin !== 'undefined' && result.data.isSuperadmin !== user.isSuperadmin) {
          return res.status(403).json({ message: "Cannot change your own superadmin status" });
        }
      }
      
      // Prepare update data
      const updateData: any = {};
      
      if (result.data.email) {
        updateData.email = result.data.email.toLowerCase();
      }
      
      if (result.data.role) {
        updateData.role = result.data.role;
      }
      
      if (typeof result.data.isSuperadmin !== 'undefined' && req.user?.isSuperadmin) {
        updateData.isSuperadmin = result.data.isSuperadmin;
      }
      
      // Handle password reset
      let tempPassword;
      if (result.data.resetPassword) {
        // Generate a random password
        tempPassword = randomBytes(10).toString('hex');
        updateData.passwordHash = await hashPassword(tempPassword);
        updateData.changePasswordRequired = true;
      }
      
      // Update the user
      const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();
      
      // Log the update
      await Logger.logSecurity(`User updated by admin: ${updatedUser.email}`, {
        userId: req.user?.id,
        resourceId: updatedUser.id,
        resourceType: 'user',
        details: {
          role: updatedUser.role,
          isSuperadmin: updatedUser.isSuperadmin,
          passwordReset: result.data.resetPassword || false,
        }
      });
      
      // Include generated password in response if reset was requested
      const response = {
        ...updatedUser,
        ...(tempPassword ? { generatedPassword: tempPassword } : {}),
      };
      
      res.json(response);
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to update user" });
    }
  }
);

// Delete user (admin only)
router.delete(
  "/users/:id",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Cannot delete yourself
      if (userId === req.user?.id) {
        return res.status(403).json({ message: "Cannot delete your own account" });
      }
      
      // Get the user
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only superadmins can delete admin accounts
      if ((user.role === "admin" || user.isSuperadmin) && !req.user?.isSuperadmin) {
        return res.status(403).json({ message: "Only superadmins can delete admin accounts" });
      }
      
      // Delete the user
      await db.delete(users).where(eq(users.id, userId));
      
      // Log the deletion
      await Logger.logSecurity(`User deleted by admin: ${user.email}`, {
        userId: req.user?.id,
        resourceId: userId,
        resourceType: 'user',
        details: {
          userEmail: user.email,
          userRole: user.role,
        }
      });
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);

// Lock user account
router.post(
  "/users/:id/lock",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Cannot lock yourself
      if (userId === req.user?.id) {
        return res.status(403).json({ message: "Cannot lock your own account" });
      }
      
      // Get the user
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only superadmins can lock admin accounts
      if ((user.role === "admin" || user.isSuperadmin) && !req.user?.isSuperadmin) {
        return res.status(403).json({ 
          message: "Only superadmins can lock admin accounts" 
        });
      }
      
      // Set lock for 24 hours
      const lockUntil = new Date();
      lockUntil.setHours(lockUntil.getHours() + 24);
      
      // Update the user
      await db.update(users)
        .set({
          failedLoginAttempts: 5, // Set to max attempts to prevent immediate unlock
          accountLocked: true,
          lockExpiresAt: lockUntil
        })
        .where(eq(users.id, userId));
      
      // Log the action
      await Logger.logSecurity(`User account locked by admin: ${user.email}`, {
        userId: req.user?.id,
        resourceId: userId,
        resourceType: 'user',
        details: {
          lockUntil: lockUntil.toISOString(),
        }
      });
      
      res.json({ 
        message: "User account locked successfully",
        lockUntil
      });
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to lock user account" });
    }
  }
);

// Unlock user account
router.post(
  "/users/:id/unlock",
  authenticateToken,
  authorizeRoles("admin"), 
  async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Get the user
      const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only superadmins can unlock admin accounts
      if ((user.role === "admin" || user.isSuperadmin) && !req.user?.isSuperadmin) {
        return res.status(403).json({ 
          message: "Only superadmins can unlock admin accounts" 
        });
      }
      
      // Update the user
      await db.update(users)
        .set({
          failedLoginAttempts: 0,
          accountLocked: false,
          lockExpiresAt: null
        })
        .where(eq(users.id, userId));
      
      // Log the action
      await Logger.logSecurity(`User account unlocked by admin: ${user.email}`, {
        userId: req.user?.id,
        resourceId: userId,
        resourceType: 'user'
      });
      
      res.json({ message: "User account unlocked successfully" });
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to unlock user account" });
    }
  }
);

export default router;