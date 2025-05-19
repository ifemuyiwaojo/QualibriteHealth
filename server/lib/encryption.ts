/**
 * Encryption Service for Qualibrite Health
 * 
 * Part of Phase 3 security improvements, this module provides strong encryption
 * for sensitive patient data.
 * 
 * Implementation uses Node.js built-in crypto module with strong AES-256-GCM
 * authenticated encryption to provide confidentiality and data integrity.
 */

import crypto from 'crypto';
import { Logger } from './logger';

// Algorithm, key length and options
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits (recommended for GCM)
const AUTH_TAG_LENGTH = 16; // 128 bits

// Get encryption key from environment or generate one during first run
// In production, this should be a securely stored environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || generateEncryptionKey();

/**
 * Generate a secure encryption key
 * This should only be used during initial setup
 */
function generateEncryptionKey(): string {
  const key = crypto.randomBytes(KEY_LENGTH).toString('hex');
  console.warn('WARNING: No encryption key provided in environment variables. A random key has been generated for this session. Data encrypted with this key will not be recoverable if the application restarts. Set ENCRYPTION_KEY environment variable in production.');
  return key;
}

/**
 * Interface for encrypted data structure
 */
export interface EncryptedData {
  iv: string;         // Initialization vector (unique per encryption)
  authTag: string;    // Authentication tag from GCM mode (validates integrity)
  encryptedData: string; // The actual encrypted data
}

/**
 * Encrypt a string value using AES-256-GCM
 * 
 * @param text The plain text to encrypt
 * @returns EncryptedData object with iv, authTag and encryptedData
 */
export function encrypt(text: string): EncryptedData {
  try {
    // Generate a random initialization vector for each encryption
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with key, iv, and GCM mode
    const cipher = crypto.createCipheriv(
      ALGORITHM, 
      Buffer.from(ENCRYPTION_KEY, 'hex'), 
      iv
    );
    
    // Encrypt the data
    let encryptedData = cipher.update(text, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Return encrypted data with IV and auth tag
    return {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      encryptedData
    };
  } catch (error) {
    Logger.logError(error as Error, 'encryption', {
      details: { action: 'encrypt' }
    });
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt an encrypted value
 * 
 * @param encryptedData EncryptedData object with iv, authTag, and encryptedData
 * @returns Decrypted string
 */
export function decrypt(encryptedData: EncryptedData): string {
  try {
    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    // Set auth tag
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    Logger.logError(error as Error, 'encryption', {
      details: { action: 'decrypt' }
    });
    throw new Error('Decryption failed');
  }
}

/**
 * Helper to encrypt specified fields in an object
 * This will encrypt the specified fields in-place
 * 
 * @param obj Object containing fields to encrypt
 * @param fields Array of field names to encrypt
 * @returns Object with encrypted fields
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T, 
  fields: string[]
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (field in obj && typeof obj[field] === 'string' && obj[field]) {
      result[field] = encrypt(obj[field]);
    }
  }
  
  // Mark which fields are encrypted for easier decryption later
  (result as any)._encrypted_fields = fields;
  
  return result;
}

/**
 * Helper to decrypt specified fields in an object
 * 
 * @param obj Object containing encrypted fields
 * @param fields Array of field names to decrypt (optional, will use _encrypted_fields if not provided)
 * @returns Object with decrypted fields
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T, 
  fields?: string[]
): T {
  const result = { ...obj };
  const fieldsToDecrypt = fields || (obj as any)._encrypted_fields || [];
  
  for (const field of fieldsToDecrypt) {
    if (field in obj && typeof obj[field] === 'object' && obj[field] !== null) {
      try {
        result[field] = decrypt(obj[field] as EncryptedData);
      } catch (error) {
        // If decryption fails, leave the field as is
        Logger.logError(error as Error, 'encryption', {
          details: { action: 'decryptFields', field }
        });
      }
    }
  }
  
  return result;
}