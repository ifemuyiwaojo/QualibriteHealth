/**
 * Utility functions for password generation and manipulation
 * Used by the temporary password generation feature for admin users
 */

/**
 * Options for generating a secure password
 */
export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  specialChars: boolean;
}

/**
 * Generate a secure random password based on provided options
 * @param options Password generation options
 * @returns A randomly generated password string
 */
export function generateSecurePassword(options: PasswordOptions): string {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed ambiguous characters I, O
  const lowercaseChars = 'abcdefghijkmnpqrstuvwxyz'; // Removed ambiguous characters l, o
  const numberChars = '23456789'; // Removed ambiguous characters 0, 1
  const specialChars = '!@#$%^&*-_=+';
  
  let availableChars = '';
  let requiredChars: string[] = [];
  
  // Build the character sets based on options
  if (options.uppercase) {
    availableChars += uppercaseChars;
    requiredChars.push(getRandomChar(uppercaseChars));
  }
  
  if (options.lowercase) {
    availableChars += lowercaseChars;
    requiredChars.push(getRandomChar(lowercaseChars));
  }
  
  if (options.numbers) {
    availableChars += numberChars;
    requiredChars.push(getRandomChar(numberChars));
  }
  
  if (options.specialChars) {
    availableChars += specialChars;
    requiredChars.push(getRandomChar(specialChars));
  }
  
  // If no character types were selected, default to lowercase
  if (availableChars === '') {
    availableChars = lowercaseChars;
    requiredChars = [getRandomChar(lowercaseChars)];
  }
  
  // Generate the remaining characters
  let result = '';
  const remainingLength = options.length - requiredChars.length;
  
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * availableChars.length);
    result += availableChars[randomIndex];
  }
  
  // Add the required characters to ensure at least one of each selected type
  result += requiredChars.join('');
  
  // Shuffle the result to avoid patterns
  return shuffleString(result);
}

/**
 * Get a random character from a string
 * @param chars String of characters to select from
 * @returns A single random character
 */
function getRandomChar(chars: string): string {
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}

/**
 * Shuffle a string using Fisher-Yates algorithm
 * @param str String to shuffle
 * @returns Shuffled string
 */
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}