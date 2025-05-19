/**
 * Secret Manager Service
 * 
 * This module provides functionality for managing security secrets
 * as part of Phase 2 security improvements for Qualibrite Health.
 * 
 * Features:
 * - Secure JWT secret management with rotation capability
 * - Supports graceful validation of tokens signed with previous secrets
 * - Secret versioning for audit and tracking
 */

import * as fs from 'fs';
import * as crypto from 'crypto';
import { Logger } from './logger';

interface Secret {
  value: string;
  version: number;
  createdAt: string;
}

/**
 * Secret Manager handles all security-sensitive secrets for the application
 */
export class SecretManager {
  private static instance: SecretManager;
  private jwtSecrets: Secret[] = [];
  private currentJwtSecretIndex = 0;
  
  private constructor() {
    this.initializeSecrets();
  }
  
  /**
   * Get singleton instance of SecretManager
   */
  public static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }
  
  /**
   * Initialize secrets from environment or generate if needed
   */
  private initializeSecrets(): void {
    try {
      // Get JWT secret from environment variable
      const envSecret = process.env.JWT_SECRET;
      
      if (envSecret) {
        // Create initial secret entry
        this.jwtSecrets.push({
          value: envSecret,
          version: 1,
          createdAt: new Date().toISOString()
        });
        
        Logger.log('info', 'system', 'JWT secret loaded from environment');
      } else {
        // Generate a secure random secret
        const generatedSecret = crypto.randomBytes(64).toString('hex');
        
        this.jwtSecrets.push({
          value: generatedSecret,
          version: 1,
          createdAt: new Date().toISOString()
        });
        
        Logger.log('warning', 'system', 'JWT secret not found in environment, generated a temporary one');
        console.warn('WARNING: Using auto-generated JWT secret. Set JWT_SECRET environment variable for production.');
      }
    } catch (error) {
      console.error('Error initializing secrets:', error);
      
      // Fallback to a temporary secret if initialization fails
      const fallbackSecret = crypto.randomBytes(64).toString('hex');
      
      this.jwtSecrets.push({
        value: fallbackSecret,
        version: 0, // Mark as temporary
        createdAt: new Date().toISOString()
      });
      
      Logger.logError(error as Error, 'system', {
        details: { message: 'Error initializing secrets, using temporary secret' }
      });
    }
  }
  
  /**
   * Get current JWT secret for signing tokens
   */
  public static getJwtSecret(): string {
    const instance = SecretManager.getInstance();
    return instance.jwtSecrets[instance.currentJwtSecretIndex].value;
  }
  
  /**
   * Get all active JWT secrets for token validation
   * This allows validating tokens signed with previous secrets
   * during the rotation grace period
   */
  public static getAllJwtSecrets(): string[] {
    const instance = SecretManager.getInstance();
    return instance.jwtSecrets.map(secret => secret.value);
  }
  
  /**
   * Alias for backward compatibility with existing code
   */
  public static getCurrentSecret(): string {
    return SecretManager.getJwtSecret();
  }
  
  /**
   * Alias for backward compatibility with existing code
   */
  public static getAllValidSecrets(): string[] {
    return SecretManager.getAllJwtSecrets();
  }
  
  /**
   * Rotate JWT secret
   * Generates a new secret while keeping the old one valid
   * for a grace period, allowing existing tokens to remain valid
   */
  public static rotateJwtSecret(): void {
    const instance = SecretManager.getInstance();
    
    // Generate new secret
    const newSecret = crypto.randomBytes(64).toString('hex');
    const newVersion = Math.max(...instance.jwtSecrets.map(s => s.version)) + 1;
    
    // Add new secret to beginning of array
    instance.jwtSecrets.unshift({
      value: newSecret,
      version: newVersion,
      createdAt: new Date().toISOString()
    });
    
    // Update current index to point to new secret
    instance.currentJwtSecretIndex = 0;
    
    // Keep only the last 2 secrets (current and previous)
    if (instance.jwtSecrets.length > 2) {
      instance.jwtSecrets = instance.jwtSecrets.slice(0, 2);
    }
    
    Logger.logSecurity('JWT secret rotated successfully', {
      details: { version: newVersion }
    });
  }
  
  /**
   * Get information about the current secret for auditing
   */
  public static getCurrentSecretInfo(): { version: number; createdAt: string } {
    const instance = SecretManager.getInstance();
    const currentSecret = instance.jwtSecrets[instance.currentJwtSecretIndex];
    
    return {
      version: currentSecret.version,
      createdAt: currentSecret.createdAt
    };
  }
}