/**
 * Password validation utilities for Qualibrite Health
 * 
 * These functions help enforce strong password requirements
 * to improve security for healthcare-related accounts.
 */

/**
 * Minimum requirements for password complexity
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true,
  // Maximum time allowed to reuse the same password, in days
  maxPasswordAge: 90
};

/**
 * Error messages for password validation failures
 */
export const PASSWORD_ERROR_MESSAGES = {
  tooShort: `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`,
  needsUppercase: 'Password must include at least one uppercase letter',
  needsLowercase: 'Password must include at least one lowercase letter',
  needsNumber: 'Password must include at least one number',
  needsSpecial: 'Password must include at least one special character',
  sameAsCurrent: 'New password must be different from your current password',
  commonPassword: 'This password is too common and easily guessed',
  containsPersonalInfo: 'Password should not contain personal information'
};

/**
 * Check if a password meets all security requirements
 * 
 * @param password The password to validate
 * @returns Object with validation result and any error messages
 */
export function validatePassword(password: string): { 
  valid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  // Check length
  if (!password || password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(PASSWORD_ERROR_MESSAGES.tooShort);
  }
  
  // Check for uppercase letters
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.needsUppercase);
  }
  
  // Check for lowercase letters
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.needsLowercase);
  }
  
  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.needsNumber);
  }
  
  // Check for special characters
  if (PASSWORD_REQUIREMENTS.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.needsSpecial);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check if a password matches with the confirmed password
 * 
 * @param password The password to check
 * @param confirmPassword The confirmation password to compare against
 * @returns Whether the passwords match
 */
export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

/**
 * Check if the new password is different from the current password
 * 
 * @param currentPassword User's current password
 * @param newPassword New password to set
 * @returns Whether the new password is different
 */
export function isPasswordDifferent(currentPassword: string, newPassword: string): boolean {
  return currentPassword !== newPassword;
}

/**
 * Calculate the strength of a password between 0-100
 * 
 * @param password The password to analyze
 * @returns A number from 0-100 representing password strength
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  
  // Award points for length
  strength += Math.min(password.length * 4, 40);
  
  // Award points for character diversity
  if (/[A-Z]/.test(password)) strength += 10;
  if (/[a-z]/.test(password)) strength += 10;
  if (/[0-9]/.test(password)) strength += 10;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;
  
  // Award points for complexity patterns
  if (/[A-Z].*[A-Z]/.test(password)) strength += 5;
  if (/[a-z].*[a-z]/.test(password)) strength += 5;
  if (/[0-9].*[0-9]/.test(password)) strength += 5;
  if (/[^A-Za-z0-9].*[^A-Za-z0-9]/.test(password)) strength += 5;
  
  // Penalize for patterns
  if (/^[A-Za-z]+$/.test(password)) strength -= 10;
  if (/^[0-9]+$/.test(password)) strength -= 15;
  if (/(.)\1{2,}/.test(password)) strength -= 10; // Repeated characters
  
  // Cap strength between 0-100
  return Math.max(0, Math.min(100, strength));
}