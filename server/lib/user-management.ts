/**
 * User Management Library for Qualibrite Health
 * 
 * This module provides standardized functionality for user creation, authentication,
 * and management across the application.
 */

import { db } from "@db";
import { users } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AppError } from "./error-handler";

/**
 * Create a new user with proper validation and security
 */
export async function createUser(userData: {
  email: string;
  password: string;
  role: string;
  name?: string;
  phone?: string;
  isSuperadmin?: boolean;
  requirePasswordChange?: boolean;
}) {
  // Validate email is not already in use
  const existingUser = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.email, userData.email.toLowerCase()))
    .limit(1);
  
  if (existingUser.length > 0) {
    throw new AppError("User with this email already exists", 409, "EMAIL_EXISTS");
  }
  
  // Hash password with secure algorithm
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  // Create metadata with user profile information
  const metadata = {
    name: userData.name || '',
    phone: userData.phone || ''
  };
  
  // Create user with consistent defaults
  try {
    const [newUser] = await db.insert(users).values({
      email: userData.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: userData.role as any,
      isSuperadmin: userData.isSuperadmin || false,
      changePasswordRequired: userData.requirePasswordChange !== false,
      emailVerified: true, // Enable immediate login
      metadata // Add user profile information
    }).returning();
    
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new AppError("Failed to create user", 500, "USER_CREATION_FAILED");
  }
}

/**
 * Verify if a password matches the stored hash
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Get filtered list of users based on role permissions
 */
export async function getFilteredUsers(
  requestingUserId: number, 
  isSuperadmin: boolean,
  role?: string
) {
  // Get all users
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  
  // Apply filtering logic based on permissions
  let filteredUsers = allUsers;
  
  if (!isSuperadmin) {
    // Regular admins can only see specific roles and can't see other admins
    filteredUsers = allUsers.filter(user => {
      // Always exclude superadmins
      if (user.isSuperadmin && user.id !== requestingUserId) return false;
      
      // Exclude other admins unless it's the current user
      if (user.role === "admin" && user.id !== requestingUserId) return false;
      
      // If role filter is provided, apply it
      if (role && user.role !== role) return false;
      
      return true;
    });
  } else if (role) {
    // Superadmins with role filter
    filteredUsers = allUsers.filter(user => user.role === role);
  }
  
  // Remove sensitive data before returning
  return filteredUsers.map(({ passwordHash, ...user }) => user);
}

/**
 * Get users by role - specifically for provider management and similar components
 */
export async function getUsersByRole(role: string) {
  try {
    // Execute query with plain SQL conditions for better compatibility
    const roleUsers = await db.select().from(users)
      .where(eq(users.role, role as any))
      .orderBy(desc(users.createdAt));
    
    // Remove sensitive data and add metadata parsing
    return roleUsers.map(({ passwordHash, metadata, ...user }) => {
      let parsedMetadata = {};
      
      // Parse metadata if it exists
      if (metadata) {
        try {
          parsedMetadata = typeof metadata === 'string' 
            ? JSON.parse(metadata) 
            : metadata;
        } catch (e) {
          console.error('Error parsing metadata for user', user.id);
        }
      }
      
      // Return user with parsed metadata
      return {
        ...user,
        name: parsedMetadata?.name || '',
        phone: parsedMetadata?.phone || '',
        metadata: parsedMetadata
      };
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return [];
  }
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(): string {
  const upperChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const specialChars = '!@#$%^&*';
  
  const allChars = upperChars + lowerChars + numbers + specialChars;
  let password = '';
  
  // Ensure at least one of each character type
  password += upperChars[Math.floor(Math.random() * upperChars.length)];
  password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill remaining length with random characters
  for (let i = 0; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to prevent predictable patterns
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}