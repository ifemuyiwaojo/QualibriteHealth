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
      const roleFilter = req.query.role as string | undefined;
      
      // Get all users with optional role filtering
      let query = db.select().from(users);
      
      // Apply database-level role filtering for better performance
      if (roleFilter) {
        query = query.where(eq(users.role, roleFilter as any));
      }
      
      // Execute query with ordering
      const allUsers = await query.orderBy(desc(users.createdAt));
      
      // Apply permission-based filtering
      let filteredUsers = isSuperadmin 
        ? allUsers
        : allUsers.filter(user => {
            // Always exclude superadmins except self
            if (user.isSuperadmin && user.id !== req.user?.id) return false;
            
            // Exclude other admins unless it's the current user
            if (user.role === "admin" && user.id !== req.user?.id) return false;
            
            return true;
          });
      
      // Remove sensitive data and format metadata
      const sanitizedUsers = filteredUsers.map(({ passwordHash, metadata, ...user }) => {
        // Parse metadata if it exists
        let parsedMetadata = {};
        let name = '';
        let phone = '';
        
        try {
          if (metadata) {
            parsedMetadata = typeof metadata === 'string' 
              ? JSON.parse(metadata) 
              : metadata;
              
            if (parsedMetadata && typeof parsedMetadata === 'object') {
              name = (parsedMetadata as any).name || '';
              phone = (parsedMetadata as any).phone || '';
            }
          }
        } catch (e) {
          console.error('Error parsing metadata for user', user.id);
        }
        
        return {
          ...user,
          name,
          phone,
          metadata: parsedMetadata
        };
      });
      
      // Log successful query
      console.log(`Fetched ${sanitizedUsers.length} users ${roleFilter ? `with role: ${roleFilter}` : ''}`);
      
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      
      // Proper metadata handling - store name and phone as serialized JSON
      let metadata = JSON.stringify({
        name: name || '',
        phone: phone || ''
      });
      
      // Create the user with all necessary fields
      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash: await hashPassword(password),
        role: role as any, // Cast to the enum type
        isSuperadmin: isSuperadmin || false,
        changePasswordRequired: requirePasswordChange === false ? false : true,
        emailVerified: true, // Set to true to allow immediate login
        metadata: metadata // Store user metadata
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
      
      // Validate request body with enhanced superadmin controls
      const schema = z.object({
        email: z.string().email().optional(),
        role: z.string().optional(),
        name: z.string().optional(),
        phone: z.string().optional(),
        isActive: z.boolean().optional(),
        isSuperadmin: z.boolean().optional(),
        resetPassword: z.boolean().optional(),
        // Enhanced superadmin privileges
        enableMfa: z.boolean().optional(),
        archiveUser: z.boolean().optional(),
        lockAccount: z.boolean().optional(),
        requirePasswordChange: z.boolean().optional(),
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
      
      // Handle password reset and require password change
      let tempPassword;
      if (result.data.resetPassword) {
        // Generate a HIPAA-compliant random password
        // Pattern: 1 uppercase, 1 lowercase, 1 number, 1 special char, min 10 chars
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const getRandomChar = (charSet) => charSet[Math.floor(Math.random() * charSet.length)];
        
        // Start with one of each required character type
        tempPassword = getRandomChar(uppercaseChars) +
                       getRandomChar(lowercaseChars) +
                       getRandomChar(numberChars) +
                       getRandomChar(specialChars);
        
        // Add 6 more random chars for length
        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        for (let i = 0; i < 6; i++) {
          tempPassword += getRandomChar(allChars);
        }
        
        // Shuffle the password characters
        tempPassword = tempPassword
          .split('')
          .sort(() => 0.5 - Math.random())
          .join('');
        
        updateData.passwordHash = await hashPassword(tempPassword);
        updateData.changePasswordRequired = true; // Field name in schema is changePasswordRequired
      }
      
      // Handle require password change flag separately
      if (typeof result.data.requirePasswordChange !== 'undefined') {
        updateData.changePasswordRequired = result.data.requirePasswordChange;
      }
      
      // Handle superadmin-specific actions
      if (req.user?.isSuperadmin) {
        // Set active status
        if (typeof result.data.isActive !== 'undefined') {
          updateData.isActive = result.data.isActive;
        }
        
        // Handle MFA settings - use the actual database field
        if (typeof result.data.enableMfa !== 'undefined') {
          // Update the dedicated MFA field in the database
          updateData.mfaEnabled = result.data.enableMfa;
        }
        
        // Handle name and phone in metadata (PHI data)
        // First ensure we're working with an object for metadata
        const userMetadata = typeof user.metadata === 'object' ? 
          { ...user.metadata } : {};
        
        // Update name and phone fields if provided (even empty strings)
        if (result.data.name !== undefined) {
          userMetadata.name = result.data.name;
        }
        
        if (result.data.phone !== undefined) {
          userMetadata.phone = result.data.phone;
        }
        
        // Always apply metadata updates to ensure consistency
        updateData.metadata = userMetadata;
        
        // Handle account archiving
        if (result.data.archiveUser) {
          updateData.isActive = false;
          updateData.isArchived = true;
          
          // Log this critical security action
          await Logger.logSecurity(`User archived by superadmin: ${user.email}`, {
            userId: req.user?.id,
            resourceId: user.id,
            resourceType: 'user'
          });
        }
        
        // Handle account lockout
        if (typeof result.data.lockAccount !== 'undefined') {
          updateData.accountLocked = result.data.lockAccount;
          if (!result.data.lockAccount) {
            // Reset failed login attempts when manually unlocking
            updateData.failedLoginAttempts = 0;
            updateData.lockExpiresAt = null;
          } else {
            // Set lock expiry when manually locking
            const lockExpiry = new Date();
            lockExpiry.setDate(lockExpiry.getDate() + 1); // 24 hour lock
            updateData.lockExpiresAt = lockExpiry;
          }
        }
        
        // Handle password change requirement
        if (typeof result.data.requirePasswordChange !== 'undefined') {
          updateData.changePasswordRequired = result.data.requirePasswordChange;
        }
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

// Get providers only (admin route)
router.get(
  "/providers", 
  authenticateToken,
  authorizeRoles("admin"),
  async (req: AuthRequest, res) => {
    try {
      // Get all provider users
      const providerUsers = await db.select().from(users)
        .where(eq(users.role, "provider"))
        .orderBy(desc(users.createdAt));
      
      // Remove sensitive data and format metadata
      const sanitizedProviders = providerUsers.map(({ passwordHash, metadata, ...user }) => {
        // Parse metadata if it exists
        let parsedMetadata = {};
        let name = '';
        let phone = '';
        
        try {
          if (metadata) {
            parsedMetadata = typeof metadata === 'string' 
              ? JSON.parse(metadata) 
              : metadata;
              
            if (parsedMetadata && typeof parsedMetadata === 'object') {
              name = (parsedMetadata as any).name || '';
              phone = (parsedMetadata as any).phone || '';
            }
          }
        } catch (e) {
          console.error('Error parsing metadata for provider', user.id);
        }
        
        return {
          ...user,
          name,
          phone,
          metadata: parsedMetadata
        };
      });
      
      res.json(sanitizedProviders);
    } catch (error) {
      Logger.logError(error as Error, "system", { userId: req.user?.id });
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  }
);

// Delete user endpoint (superadmin only)
router.delete(
  "/users/:id",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Only superadmins can delete users
      if (!req.user?.isSuperadmin) {
        await Logger.logSecurity("Unauthorized attempt to delete user", {
          userId: req.user?.id,
          resourceId: userId,
          resourceType: "users",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          details: { message: "Non-superadmin attempted to delete a user" }
        });
        
        return res.status(403).json({ message: "Only superadmins can delete users" });
      }
      
      // Prevent deleting own account
      if (userId === req.user.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      
      // Get user to be deleted
      const [userToDelete] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Delete user from database
      await db.delete(users).where(eq(users.id, userId));
      
      // Log the deletion event
      await Logger.logSecurity("User account deleted", {
        userId: req.user.id,
        resourceId: userId,
        resourceType: "users",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        details: { 
          targetUserEmail: userToDelete.email,
          targetUserRole: userToDelete.role
        }
      });
      
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      Logger.logError(error as Error, "user", { userId: req.user?.id });
      return res.status(500).json({ message: "Failed to delete user" });
    }
  }
);

export default router;