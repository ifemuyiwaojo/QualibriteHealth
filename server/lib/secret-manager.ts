/**
 * Secret Manager for Qualibrite Health
 * 
 * Handles JWT secret rotation and secure secret management
 * This implementation allows for secure rotation of secrets with a grace period
 * to ensure existing tokens remain valid during the rotation process.
 */

import { randomBytes } from 'crypto';
import { Logger } from './logger';

interface SecretVersion {
  key: string;
  createdAt: Date;
  expiresAt: Date | null;
}

export class SecretManager {
  private static instance: SecretManager;
  private secrets: SecretVersion[] = [];
  private readonly defaultExpiryDays: number = 30; // Default expiry period for old secrets

  private constructor() {
    // Load initial secret from environment
    const currentSecret = process.env.JWT_SECRET;
    
    if (!currentSecret) {
      throw new Error('JWT_SECRET environment variable must be set');
    }
    
    // Add the current secret
    this.secrets.push({
      key: currentSecret,
      createdAt: new Date(),
      expiresAt: null // Current secret doesn't expire until rotated
    });
    
    Logger.log('info', 'system', 'Secret manager initialized', {});
  }

  /**
   * Get the singleton instance of the SecretManager
   */
  public static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    
    return SecretManager.instance;
  }
  
  /**
   * Get the current active secret for signing new tokens
   */
  public getCurrentSecret(): string {
    // The current secret is always the latest one with no expiry date
    const currentSecret = this.secrets.find(secret => secret.expiresAt === null);
    
    if (!currentSecret) {
      throw new Error('No active secret found');
    }
    
    return currentSecret.key;
  }
  
  /**
   * Get all valid secrets for validating tokens
   * This includes both the current secret and any still-valid expired secrets
   */
  public getAllValidSecrets(): string[] {
    const now = new Date();
    return this.secrets
      .filter(secret => secret.expiresAt === null || secret.expiresAt > now)
      .map(secret => secret.key);
  }
  
  /**
   * Rotate the JWT secret
   * This creates a new secret, marks the old one for expiration, and returns the new secret
   * 
   * @param expiryDays Number of days until the old secret expires (default: 30)
   * @returns The new secret
   */
  public rotateSecret(expiryDays: number = this.defaultExpiryDays): string {
    // Find and mark the current secret as expired
    const currentSecret = this.secrets.find(secret => secret.expiresAt === null);
    
    if (currentSecret) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      currentSecret.expiresAt = expiryDate;
      
      Logger.log('security', 'system', `Secret scheduled for expiration on ${expiryDate.toISOString()}`, {
        details: { 
          secretCreatedAt: currentSecret.createdAt.toISOString() 
        }
      });
    }
    
    // Generate a new secret
    const newSecret = randomBytes(32).toString('hex');
    
    // Add the new secret
    this.secrets.push({
      key: newSecret,
      createdAt: new Date(),
      expiresAt: null
    });
    
    Logger.log('security', 'system', 'Secret rotation completed successfully', {});
    
    // Clean up expired secrets
    this.cleanupExpiredSecrets();
    
    return newSecret;
  }
  
  /**
   * Remove any secrets that have expired
   */
  private cleanupExpiredSecrets(): void {
    const now = new Date();
    const initialCount = this.secrets.length;
    
    this.secrets = this.secrets.filter(secret => 
      secret.expiresAt === null || secret.expiresAt > now
    );
    
    const removedCount = initialCount - this.secrets.length;
    if (removedCount > 0) {
      Logger.log('security', 'system', `Removed ${removedCount} expired secrets`, {});
    }
  }
}