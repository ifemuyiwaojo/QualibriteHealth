/**
 * Authentication utility functions
 * Part of the enhanced security features for Qualibrite Health
 */

import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// Promisify the scrypt function for async/await usage
const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt with a random salt
 * @param password The plaintext password to hash
 * @returns A string containing the hashed password and salt, separated by a dot
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Compare a plaintext password with a stored hash
 * @param suppliedPassword The plaintext password to check
 * @param storedHash The stored password hash from the database
 * @returns Boolean indicating if the password is correct
 */
export async function comparePasswords(
  suppliedPassword: string,
  storedHash: string
): Promise<boolean> {
  const [hashed, salt] = storedHash.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Validate a password against HIPAA-compliant complexity requirements
 * @param password The password to validate
 * @returns An object containing validity status and any error messages
 */
export function validatePasswordComplexity(password: string): { 
  valid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  if (password.length < 10) {
    errors.push("Password must be at least 10 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}