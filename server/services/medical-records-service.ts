/**
 * Medical Records Service for Qualibrite Health
 * 
 * This service manages access to medical records with proper encryption
 * of sensitive patient data as part of Phase 3 security improvements.
 */

import { db } from "@db";
import { medicalRecords, type InsertMedicalRecord, type SelectMedicalRecord } from "@db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { encryptObject, decryptObject, isEncrypted } from "../lib/encryption";
import { Logger } from "../lib/logger";
import { AppError } from "../lib/error-handler";

// Fields containing sensitive data that should be encrypted
const SENSITIVE_FIELDS = [
  'content', // Contains diagnosis, treatment plans, etc.
];

/**
 * Create a new medical record with encrypted sensitive fields
 */
export async function createMedicalRecord(
  data: InsertMedicalRecord,
  userId: number
): Promise<SelectMedicalRecord> {
  try {
    // Encrypt sensitive fields
    const encryptedData = encryptObject(data, SENSITIVE_FIELDS);
    
    // Insert record with encrypted data
    const [record] = await db.insert(medicalRecords)
      .values(encryptedData)
      .returning();
    
    // Log audit event
    await Logger.log(
      'info', 
      'record', 
      'Medical record created',
      {
        userId,
        resourceId: record.id,
        resourceType: 'medical_record',
        details: {
          patientId: data.patientProfileId,
          providerId: data.providerProfileId,
          recordType: data.type
        }
      }
    );
    
    // Return decrypted record for immediate use
    return decryptObject(record);
  } catch (error) {
    Logger.logError(error as Error, 'record', { userId });
    throw new AppError("Failed to create medical record", 500, "DB_ERROR");
  }
}

/**
 * Get a medical record by ID with decrypted data
 */
export async function getMedicalRecordById(
  id: number,
  userId: number,
  userRole: string
): Promise<SelectMedicalRecord> {
  try {
    const [record] = await db.select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, id))
      .limit(1);
    
    if (!record) {
      throw new AppError("Medical record not found", 404, "NOT_FOUND");
    }
    
    // Check access permissions
    await checkAccessPermission(record, userId, userRole);
    
    // Log read access
    await Logger.log(
      'info', 
      'record', 
      'Medical record accessed',
      {
        userId,
        resourceId: record.id,
        resourceType: 'medical_record'
      }
    );
    
    // Decrypt sensitive data
    return decryptObject(record);
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    Logger.logError(error as Error, 'record', { userId });
    throw new AppError("Failed to retrieve medical record", 500, "DB_ERROR");
  }
}

/**
 * Get all medical records for a patient with decrypted data
 */
export async function getPatientMedicalRecords(
  patientId: number,
  userId: number,
  userRole: string
): Promise<SelectMedicalRecord[]> {
  try {
    const records = await db.select()
      .from(medicalRecords)
      .where(eq(medicalRecords.patientProfileId, patientId))
      .orderBy(desc(medicalRecords.visitDate));
    
    // Check access permissions
    // Full permission check would be performed in middleware or controller
    
    // Log batch access
    await Logger.log(
      'info', 
      'record', 
      'Patient medical records accessed',
      {
        userId,
        resourceType: 'medical_record',
        details: {
          patientId,
          count: records.length
        }
      }
    );
    
    // Decrypt all records
    return records.map(record => decryptObject(record));
  } catch (error) {
    Logger.logError(error as Error, 'record', { userId });
    throw new AppError("Failed to retrieve patient medical records", 500, "DB_ERROR");
  }
}

/**
 * Update a medical record with encrypted sensitive data
 */
export async function updateMedicalRecord(
  id: number,
  data: Partial<InsertMedicalRecord>,
  userId: number,
  userRole: string
): Promise<SelectMedicalRecord> {
  try {
    // First get existing record to check permissions
    const [existingRecord] = await db.select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, id))
      .limit(1);
    
    if (!existingRecord) {
      throw new AppError("Medical record not found", 404, "NOT_FOUND");
    }
    
    // Check access permissions
    await checkAccessPermission(existingRecord, userId, userRole);
    
    // Only encrypt fields that are actually being updated
    const fieldsToEncrypt = SENSITIVE_FIELDS.filter(field => field in data);
    const encryptedData = encryptObject(data, fieldsToEncrypt);
    
    // Update with encrypted data
    const [updatedRecord] = await db.update(medicalRecords)
      .set({
        ...encryptedData,
        updatedAt: new Date()
      })
      .where(eq(medicalRecords.id, id))
      .returning();
    
    // Log update
    await Logger.log(
      'info', 
      'record', 
      'Medical record updated',
      {
        userId,
        resourceId: id,
        resourceType: 'medical_record',
        details: {
          patientId: existingRecord.patientProfileId,
          providerId: existingRecord.providerProfileId,
        }
      }
    );
    
    // Return decrypted record
    return decryptObject(updatedRecord);
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    Logger.logError(error as Error, 'record', { userId });
    throw new AppError("Failed to update medical record", 500, "DB_ERROR");
  }
}

/**
 * Delete a medical record with proper access checks
 */
export async function deleteMedicalRecord(
  id: number,
  userId: number,
  userRole: string
): Promise<{ success: boolean }> {
  try {
    // First get existing record to check permissions
    const [existingRecord] = await db.select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, id))
      .limit(1);
    
    if (!existingRecord) {
      throw new AppError("Medical record not found", 404, "NOT_FOUND");
    }
    
    // Check access permissions - stricter for deletion
    await checkDeletePermission(existingRecord, userId, userRole);
    
    // Delete record
    await db.delete(medicalRecords)
      .where(eq(medicalRecords.id, id));
    
    // Log high-security deletion event
    await Logger.logSecurity(
      'Medical record deleted',
      {
        userId,
        resourceId: id,
        resourceType: 'medical_record',
        details: {
          patientId: existingRecord.patientProfileId,
          providerId: existingRecord.providerProfileId,
          recordType: existingRecord.type
        }
      }
    );
    
    return { success: true };
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    Logger.logError(error as Error, 'record', { userId });
    throw new AppError("Failed to delete medical record", 500, "DB_ERROR");
  }
}

/**
 * Helper to check if user has permission to access this record
 */
async function checkAccessPermission(
  record: SelectMedicalRecord, 
  userId: number,
  userRole: string
): Promise<void> {
  // Admin and superadmin always have access
  if (userRole === 'admin') {
    return;
  }
  
  // Check provider access - providers can access records of their patients
  if (userRole === 'provider') {
    // Get provider profile ID for this user
    const providerProfiles = await db.execute(sql`
      SELECT id FROM provider_profiles WHERE user_id = ${userId}
    `);
    
    if (providerProfiles.rows.length > 0) {
      const providerProfileId = providerProfiles.rows[0].id;
      if (record.providerProfileId === providerProfileId) {
        return;
      }
    }
  }
  
  // Check patient access - patients can only access their own records
  if (userRole === 'patient') {
    // Get patient profile ID for this user
    const patientProfiles = await db.execute(sql`
      SELECT id FROM patient_profiles WHERE user_id = ${userId}
    `);
    
    if (patientProfiles.rows.length > 0) {
      const patientProfileId = patientProfiles.rows[0].id;
      if (record.patientProfileId === patientProfileId) {
        return;
      }
    }
  }
  
  // If we reach here, access is denied
  throw new AppError("Access denied to medical record", 403, "ACCESS_DENIED");
}

/**
 * Helper to check if user has permission to delete this record
 * More restrictive than read/write permissions
 */
async function checkDeletePermission(
  record: SelectMedicalRecord, 
  userId: number,
  userRole: string
): Promise<void> {
  // Only admins and the original provider can delete records
  if (userRole === 'admin') {
    return; // Admins can delete
  }
  
  if (userRole === 'provider') {
    // Get provider profile ID for this user
    const providerProfiles = await db.execute(sql`
      SELECT id FROM provider_profiles WHERE user_id = ${userId}
    `);
    
    // Only the provider who created the record can delete it
    if (providerProfiles.rows.length > 0) {
      const providerProfileId = providerProfiles.rows[0].id;
      if (record.providerProfileId === providerProfileId) {
        return;
      }
    }
  }
  
  // If we reach here, deletion is not allowed
  throw new AppError("Not authorized to delete medical record", 403, "ACCESS_DENIED");
}