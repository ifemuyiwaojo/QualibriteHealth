/**
 * Medical Records Service for Qualibrite Health
 * 
 * This service manages access to medical records with proper encryption
 * of sensitive patient data as part of Phase 3 security improvements.
 */

import { db } from '@db';
import { eq, and } from 'drizzle-orm';
import { 
  medicalRecords, 
  patientProfiles, 
  providerProfiles, 
  type InsertMedicalRecord,
  type SelectMedicalRecord,
  type MedicalRecordContent
} from '@db/schema';
import type { AuthUser } from '../middleware/auth';
import { encrypt, decrypt } from '../lib/encryption';
import { AppError } from '../lib/error-handler';

// Fields that should be encrypted in medical records
const SENSITIVE_FIELDS = ['diagnosis', 'prescription', 'treatment'];

/**
 * Create a new medical record with encrypted sensitive fields
 */
export async function createMedicalRecord(
  data: InsertMedicalRecord,
  userId: number
): Promise<SelectMedicalRecord> {
  // Encrypt sensitive fields in the content
  const encryptedContent = encryptSensitiveFields(data.content as MedicalRecordContent);

  // Create record with encrypted content
  const [record] = await db.insert(medicalRecords)
    .values({
      ...data,
      content: encryptedContent as any,
      // Convert visitDate from string to Date if needed
      visitDate: typeof data.visitDate === 'string' 
        ? new Date(data.visitDate) 
        : data.visitDate
    })
    .returning();

  return record;
}

/**
 * Get a medical record by ID with decrypted data
 */
export async function getMedicalRecordById(
  id: number, 
  user: AuthUser
): Promise<SelectMedicalRecord> {
  const [record] = await db.select()
    .from(medicalRecords)
    .where(eq(medicalRecords.id, id))
    .limit(1);

  if (!record) {
    throw new AppError('Medical record not found', 404, 'NOT_FOUND');
  }

  // Check if user has permission to access this record
  await checkAccessPermission(record, user);

  // Decrypt sensitive fields before returning
  const decryptedRecord = {
    ...record,
    content: decryptSensitiveFields(record.content as MedicalRecordContent)
  };

  return decryptedRecord;
}

/**
 * Get all medical records for a patient with decrypted data
 */
export async function getPatientMedicalRecords(
  patientProfileId: number,
  user: AuthUser
): Promise<SelectMedicalRecord[]> {
  // Check if user has permission to access this patient's records
  await checkPatientAccessPermission(patientProfileId, user);

  // Get all records for the patient
  const records = await db.select()
    .from(medicalRecords)
    .where(eq(medicalRecords.patientProfileId, patientProfileId));

  // Decrypt sensitive fields in all records
  return records.map(record => ({
    ...record,
    content: decryptSensitiveFields(record.content as MedicalRecordContent)
  }));
}

/**
 * Update a medical record with encrypted sensitive data
 */
export async function updateMedicalRecord(
  id: number,
  data: Partial<InsertMedicalRecord>,
  user: AuthUser
): Promise<SelectMedicalRecord> {
  // Get existing record
  const [existingRecord] = await db.select()
    .from(medicalRecords)
    .where(eq(medicalRecords.id, id))
    .limit(1);

  if (!existingRecord) {
    throw new AppError('Medical record not found', 404, 'NOT_FOUND');
  }

  // Check if user has permission to access this record
  await checkAccessPermission(existingRecord, user);

  // If content is being updated, ensure sensitive fields are encrypted
  let updateData: Partial<InsertMedicalRecord> = { ...data };
  
  if (data.content) {
    // Decrypt existing content so we can merge with updates
    const existingContent = decryptSensitiveFields(existingRecord.content as MedicalRecordContent);
    
    // Merge with updates
    const mergedContent = {
      ...existingContent,
      ...data.content
    };
    
    // Encrypt all sensitive fields in the merged content
    updateData.content = encryptSensitiveFields(mergedContent) as any;
  }

  // Update the record
  const [updatedRecord] = await db.update(medicalRecords)
    .set({
      ...updateData,
      updatedAt: new Date()
    })
    .where(eq(medicalRecords.id, id))
    .returning();

  // Decrypt sensitive fields before returning
  return {
    ...updatedRecord,
    content: decryptSensitiveFields(updatedRecord.content as MedicalRecordContent)
  };
}

/**
 * Delete a medical record with proper access checks
 */
export async function deleteMedicalRecord(
  id: number,
  user: AuthUser
): Promise<void> {
  // Get existing record
  const [existingRecord] = await db.select()
    .from(medicalRecords)
    .where(eq(medicalRecords.id, id))
    .limit(1);

  if (!existingRecord) {
    throw new AppError('Medical record not found', 404, 'NOT_FOUND');
  }

  // Check if user has permission to delete this record
  await checkDeletePermission(existingRecord, user);

  // Delete the record
  await db.delete(medicalRecords)
    .where(eq(medicalRecords.id, id));
}

/**
 * Helper to check if user has permission to access this record
 */
async function checkAccessPermission(
  record: SelectMedicalRecord, 
  user: SelectUser
): Promise<void> {
  // Superadmins and admins have access to all records
  if (user.role === 'superadmin' || user.role === 'admin') {
    return;
  }

  // Check if user is the provider who created this record
  if (user.role === 'provider') {
    // Find provider profile for this user
    const [providerProfile] = await db.select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, user.id))
      .limit(1);

    if (providerProfile && providerProfile.id === record.providerProfileId) {
      return;
    }
  }

  // Check if user is the patient who this record belongs to
  if (user.role === 'patient') {
    // Find patient profile for this user
    const [patientProfile] = await db.select()
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, user.id))
      .limit(1);

    if (patientProfile && patientProfile.id === record.patientProfileId) {
      return;
    }
  }

  // If we get here, user doesn't have access
  throw new AppError('Access denied', 403, 'FORBIDDEN');
}

/**
 * Helper to check if user has permission to access a patient's records
 */
async function checkPatientAccessPermission(
  patientProfileId: number,
  user: SelectUser
): Promise<void> {
  // Superadmins and admins have access to all records
  if (user.role === 'superadmin' || user.role === 'admin') {
    return;
  }

  // Check if user is a provider for this patient
  if (user.role === 'provider') {
    // Find provider profile for this user
    const [providerProfile] = await db.select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, user.id))
      .limit(1);

    if (providerProfile) {
      // Check if provider has records for this patient
      const [record] = await db.select()
        .from(medicalRecords)
        .where(
          and(
            eq(medicalRecords.providerProfileId, providerProfile.id),
            eq(medicalRecords.patientProfileId, patientProfileId)
          )
        )
        .limit(1);

      if (record) {
        return;
      }
    }
  }

  // Check if user is the patient
  if (user.role === 'patient') {
    // Find patient profile for this user
    const [patientProfile] = await db.select()
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, user.id))
      .limit(1);

    if (patientProfile && patientProfile.id === patientProfileId) {
      return;
    }
  }

  // If we get here, user doesn't have access
  throw new AppError('Access denied', 403, 'FORBIDDEN');
}

/**
 * Helper to check if user has permission to delete this record
 * More restrictive than read/write permissions
 */
async function checkDeletePermission(
  record: SelectMedicalRecord, 
  user: SelectUser
): Promise<void> {
  // Only superadmins, admins, and the provider who created the record can delete
  if (user.role === 'superadmin' || user.role === 'admin') {
    return;
  }

  if (user.role === 'provider') {
    // Find provider profile for this user
    const [providerProfile] = await db.select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, user.id))
      .limit(1);

    if (providerProfile && providerProfile.id === record.providerProfileId) {
      return;
    }
  }

  // If we get here, user doesn't have permission to delete
  throw new AppError('Permission denied', 403, 'FORBIDDEN');
}

/**
 * Helper to encrypt sensitive fields in medical record content
 */
function encryptSensitiveFields(content: MedicalRecordContent): MedicalRecordContent {
  if (!content) return content;
  
  const encryptedContent = { ...content };
  
  // Encrypt sensitive fields
  for (const field of SENSITIVE_FIELDS) {
    if (field in content && content[field as keyof MedicalRecordContent]) {
      const value = content[field as keyof MedicalRecordContent] as string;
      if (value) {
        // @ts-ignore - Type is difficult to express here
        encryptedContent[field] = encrypt(value);
      }
    }
  }
  
  return encryptedContent;
}

/**
 * Helper to decrypt sensitive fields in medical record content
 */
function decryptSensitiveFields(content: MedicalRecordContent): MedicalRecordContent {
  if (!content) return content;
  
  const decryptedContent = { ...content };
  
  // Decrypt sensitive fields
  for (const field of SENSITIVE_FIELDS) {
    if (field in content && content[field as keyof MedicalRecordContent]) {
      // @ts-ignore - Type is difficult to express here
      const encryptedValue = content[field];
      
      if (typeof encryptedValue === 'object' && encryptedValue !== null) {
        try {
          // @ts-ignore - Type is difficult to express here
          decryptedContent[field] = decrypt(encryptedValue);
        } catch (error) {
          console.error(`Failed to decrypt field ${field} in medical record:`, error);
          // Leave as is if decryption fails
        }
      }
    }
  }
  
  return decryptedContent;
}