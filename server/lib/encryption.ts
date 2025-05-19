/**
 * Data Encryption Service for Qualibrite Health
 * 
 * This module provides functionality for encrypting sensitive patient data
 * as part of Phase 3 security improvements.
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
  // Generate a random encryption key
  const key = crypto.randomBytes(KEY_LENGTH).toString('hex');
  
  console.warn(
    'WARNING: No encryption key provided in environment variables. ' +
    'A random key has been generated for this session. ' +
    'Data encrypted with this key will not be recoverable if the application restarts. ' +
    'Set ENCRYPTION_KEY environment variable in production.'
  );
  
  return key;
}

/**
 * Encrypt sensitive data
 * 
 * @param data The data to encrypt (object or string)
 * @returns Encrypted data object with iv, authTag and encryptedData
 */
export function encryptData(data: any): { 
  iv: string;
  authTag: string;
  encryptedData: string;
} {
  try {
    // Convert to string if object
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with key, iv, and auth tag length
    const cipher = crypto.createCipheriv(
      ALGORITHM, 
      Buffer.from(ENCRYPTION_KEY, 'hex'), 
      iv,
      { authTagLength: AUTH_TAG_LENGTH }
    );
    
    // Encrypt the data
    let encrypted = cipher.update(stringData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Return the encrypted data with IV and auth tag
    return {
      iv: iv.toString('hex'),
      authTag,
      encryptedData: encrypted,
    };
  } catch (error) {
    Logger.logError(error as Error, 'system', {
      details: { action: 'encrypt_data' }
    });
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt encrypted data
 * 
 * @param encryptedData The encrypted data string
 * @param iv The initialization vector used for encryption
 * @param authTag The authentication tag from encryption
 * @param returnObject Whether to parse the decrypted data as JSON object
 * @returns Decrypted data as string or object
 */
export function decryptData(
  encryptedData: string,
  iv: string,
  authTag: string,
  returnObject = true
): any {
  try {
    // Create decipher with key, iv
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    // Set auth tag
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Parse as JSON if requested
    if (returnObject && decrypted) {
      return JSON.parse(decrypted);
    }
    
    return decrypted;
  } catch (error) {
    Logger.logError(error as Error, 'system', {
      details: { action: 'decrypt_data' }
    });
    throw new Error('Decryption failed. Data may be corrupted or tampered with.');
  }
}

/**
 * Encrypt an object with sensitive data
 * Only specified fields will be encrypted, the rest are left as is
 * 
 * @param object The object containing fields to encrypt
 * @param fields Array of field names to encrypt
 * @returns Object with encrypted fields
 */
export function encryptObject<T extends Record<string, any>>(
  object: T,
  fields: (keyof T)[]
): T & { _encrypted_fields?: (keyof T)[] } {
  const result = { ...object };
  const encryptedFields: (keyof T)[] = [];
  
  for (const field of fields) {
    if (object[field]) {
      // Store field value as encrypted data
      const encrypted = encryptData(object[field]);
      
      // Replace with encrypted version
      result[field] = encrypted;
      
      // Keep track of which fields are encrypted
      encryptedFields.push(field);
    }
  }
  
  // Add metadata about which fields are encrypted if any
  if (encryptedFields.length > 0) {
    result._encrypted_fields = encryptedFields;
  }
  
  return result;
}

/**
 * Decrypt an object with encrypted fields
 * 
 * @param object The object with encrypted fields
 * @returns Object with decrypted fields
 */
export function decryptObject<T extends Record<string, any>>(object: T): T {
  const result = { ...object };
  
  // Check if there are encrypted fields
  const encryptedFields = object._encrypted_fields as (keyof T)[] | undefined;
  
  if (!encryptedFields || encryptedFields.length === 0) {
    // No encrypted fields found
    return result;
  }
  
  // Decrypt each field
  for (const field of encryptedFields) {
    if (result[field]) {
      const encrypted = result[field] as {
        iv: string;
        authTag: string;
        encryptedData: string;
      };
      
      // Decrypt the field
      result[field] = decryptData(
        encrypted.encryptedData,
        encrypted.iv,
        encrypted.authTag
      );
    }
  }
  
  // Remove metadata
  delete result._encrypted_fields;
  
  return result;
}

/**
 * Check if data is already encrypted
 */
export function isEncrypted(data: any): boolean {
  return (
    data &&
    typeof data === 'object' &&
    'iv' in data &&
    'authTag' in data &&
    'encryptedData' in data
  );
}