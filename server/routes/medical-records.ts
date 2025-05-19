/**
 * Medical Records API Routes with Enhanced Security
 * 
 * Part of Phase 3 security improvements for Qualibrite Health.
 * Implements encrypted storage of sensitive patient information.
 */

import express, { Request } from 'express';
import { z } from 'zod';
import { db } from '@db';
import { selectUserSchema, medicalRecords } from '@db/schema';
import { AppError } from '../lib/error-handler';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { createMedicalRecord, getPatientMedicalRecords, getMedicalRecordById, updateMedicalRecord, deleteMedicalRecord } from '../services/medical-records-service';
import { logMedicalRecordCreate, logMedicalRecordView, logMedicalRecordUpdate, logMedicalRecordDelete } from '../lib/security-logger';
import { sanitizeInputs } from '../middleware/input-sanitization';

const router = express.Router();

// Apply input sanitization to all medical records endpoints
router.use(sanitizeInputs);

// Ensure users are authenticated for all medical records endpoints
router.use(requireAuth);

// Schema for creating medical records with validation
const createMedicalRecordSchema = z.object({
  patientProfileId: z.number(),
  providerProfileId: z.number(),
  type: z.enum(['diagnosis', 'prescription', 'lab_result', 'progress_note']),
  visitDate: z.string(), // ISO date string
  content: z.object({
    summary: z.string(),
    diagnosis: z.string().optional(),
    prescription: z.string().optional(),
    treatment: z.string().optional(),
    vitals: z.record(z.string()).optional(),
    follow_up: z.string().optional()
  })
});

// Schema for updating medical records
const updateMedicalRecordSchema = z.object({
  patientProfileId: z.number().optional(),
  providerProfileId: z.number().optional(),
  type: z.enum(['diagnosis', 'prescription', 'lab_result', 'progress_note']).optional(),
  visitDate: z.string().optional(), // ISO date string
  content: z.object({
    summary: z.string().optional(),
    diagnosis: z.string().optional(),
    prescription: z.string().optional(),
    treatment: z.string().optional(),
    vitals: z.record(z.string()).optional(),
    follow_up: z.string().optional()
  }).optional()
});

/**
 * Create a new medical record with encrypted sensitive data
 * POST /api/medical-records
 */
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const parsedData = createMedicalRecordSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new AppError('Invalid medical record data', 400, 'VALIDATION_ERROR', parsedData.error.format());
    }

    const record = await createMedicalRecord(
      parsedData.data,
      req.user!.id
    );

    // Log this security-sensitive operation
    logMedicalRecordCreate(req.user!.id, record.id, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string,
      details: {
        patientId: parsedData.data.patientProfileId,
        recordType: parsedData.data.type
      }
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

/**
 * Get a medical record by ID with decrypted data
 * GET /api/medical-records/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id);
    if (isNaN(recordId)) {
      throw new AppError('Invalid record ID', 400, 'VALIDATION_ERROR');
    }

    const record = await getMedicalRecordById(recordId, req.user!);

    // Log access to sensitive medical data
    logMedicalRecordView(req.user!.id, recordId, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });

    res.json(record);
  } catch (error) {
    next(error);
  }
});

/**
 * Get all medical records for a patient
 * GET /api/medical-records/patient/:patientId
 */
router.get('/patient/:patientId', async (req, res, next) => {
  try {
    const patientId = parseInt(req.params.patientId);
    if (isNaN(patientId)) {
      throw new AppError('Invalid patient ID', 400, 'VALIDATION_ERROR');
    }

    const records = await getPatientMedicalRecords(patientId, req.user!);

    res.json(records);
  } catch (error) {
    next(error);
  }
});

/**
 * Update a medical record with encrypted sensitive data
 * PATCH /api/medical-records/:id
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id);
    if (isNaN(recordId)) {
      throw new AppError('Invalid record ID', 400, 'VALIDATION_ERROR');
    }

    // Validate update data
    const parsedData = updateMedicalRecordSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new AppError('Invalid medical record data', 400, 'VALIDATION_ERROR', parsedData.error.format());
    }

    // Convert visitDate string to Date if provided
    let updateData = parsedData.data;
    if (updateData.visitDate) {
      updateData = {
        ...updateData,
        visitDate: new Date(updateData.visitDate)
      };
    }

    const updatedRecord = await updateMedicalRecord(
      recordId, 
      updateData,
      req.user!
    );

    // Log this security-sensitive operation
    logMedicalRecordUpdate(req.user!.id, recordId, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string,
      details: {
        updatedFields: Object.keys(req.body)
      }
    });

    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a medical record
 * DELETE /api/medical-records/:id
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const recordId = parseInt(req.params.id);
    if (isNaN(recordId)) {
      throw new AppError('Invalid record ID', 400, 'VALIDATION_ERROR');
    }

    await deleteMedicalRecord(recordId, req.user!);

    // Log this security-sensitive operation
    logMedicalRecordDelete(req.user!.id, recordId, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;