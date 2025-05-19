/**
 * Medical Records API Routes with Enhanced Security
 * 
 * Part of Phase 3 security improvements for Qualibrite Health.
 * Implements encrypted storage of sensitive patient information.
 */

import { Router } from "express";
import { z } from "zod";
import { authenticateToken } from "../middleware/auth";
import { asyncHandler, AppError } from "../lib/error-handler";
import { Logger } from "../lib/logger";
import * as MedicalRecordsService from "../services/medical-records-service";

const router = Router();

// Enhanced validation schema for medical record creation/update
const medicalRecordSchema = z.object({
  patientProfileId: z.number({
    required_error: "Patient ID is required"
  }),
  providerProfileId: z.number({
    required_error: "Provider ID is required"
  }),
  type: z.enum(['diagnosis', 'prescription', 'lab_result', 'progress_note'], {
    errorMap: () => ({ message: "Invalid medical record type" })
  }),
  visitDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Visit date must be a valid date string"
  }),
  content: z.object({
    summary: z.string().min(1, "Summary is required"),
    diagnosis: z.string().optional(),
    treatment: z.string().optional(),
    prescription: z.string().optional(),
    vitals: z.record(z.string()).optional(),
    follow_up: z.string().optional()
  })
});

/**
 * Create a new medical record with encrypted sensitive data
 * POST /api/medical-records
 */
router.post("/", authenticateToken, asyncHandler(async (req: any, res) => {
  // Validate input data
  const validationResult = medicalRecordSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    const errors = validationResult.error.format();
    throw new AppError("Invalid medical record data", 400, "VALIDATION_ERROR", errors);
  }
  
  // Create medical record with encryption service
  const newRecord = await MedicalRecordsService.createMedicalRecord(
    {
      ...validationResult.data,
      visitDate: new Date(validationResult.data.visitDate),
    },
    req.user.id
  );
  
  res.status(201).json(newRecord);
}));

/**
 * Get a medical record by ID with decrypted data
 * GET /api/medical-records/:id
 */
router.get("/:id", authenticateToken, asyncHandler(async (req: any, res) => {
  const recordId = parseInt(req.params.id);
  
  if (isNaN(recordId)) {
    throw new AppError("Invalid record ID", 400, "VALIDATION_ERROR");
  }
  
  const record = await MedicalRecordsService.getMedicalRecordById(
    recordId, 
    req.user.id,
    req.user.role
  );
  
  res.json(record);
}));

/**
 * Get all medical records for a patient
 * GET /api/medical-records/patient/:patientId
 */
router.get("/patient/:patientId", authenticateToken, asyncHandler(async (req: any, res) => {
  const patientId = parseInt(req.params.patientId);
  
  if (isNaN(patientId)) {
    throw new AppError("Invalid patient ID", 400, "VALIDATION_ERROR");
  }
  
  const records = await MedicalRecordsService.getPatientMedicalRecords(
    patientId,
    req.user.id,
    req.user.role
  );
  
  res.json(records);
}));

/**
 * Update a medical record with encrypted sensitive data
 * PATCH /api/medical-records/:id
 */
router.patch("/:id", authenticateToken, asyncHandler(async (req: any, res) => {
  const recordId = parseInt(req.params.id);
  
  if (isNaN(recordId)) {
    throw new AppError("Invalid record ID", 400, "VALIDATION_ERROR");
  }
  
  // Partial validation for updates
  const updateSchema = medicalRecordSchema.partial();
  const validationResult = updateSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    const errors = validationResult.error.format();
    throw new AppError("Invalid medical record data", 400, "VALIDATION_ERROR", errors);
  }
  
  // Process date if provided
  const data = { ...validationResult.data };
  if (data.visitDate) {
    data.visitDate = new Date(data.visitDate);
  }
  
  // Update record with encryption service
  const updatedRecord = await MedicalRecordsService.updateMedicalRecord(
    recordId,
    data,
    req.user.id,
    req.user.role
  );
  
  res.json(updatedRecord);
}));

/**
 * Delete a medical record
 * DELETE /api/medical-records/:id
 */
router.delete("/:id", authenticateToken, asyncHandler(async (req: any, res) => {
  const recordId = parseInt(req.params.id);
  
  if (isNaN(recordId)) {
    throw new AppError("Invalid record ID", 400, "VALIDATION_ERROR");
  }
  
  const result = await MedicalRecordsService.deleteMedicalRecord(
    recordId,
    req.user.id,
    req.user.role
  );
  
  res.json(result);
}));

export default router;