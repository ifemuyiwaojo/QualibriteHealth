import { Router } from "express";
import { db } from "@db";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";
import {
  users,
  patientProfiles,
  medicalRecords,
  providerProfiles,
  type SelectPatientProfile,
  type SelectMedicalRecord,
  type SelectProviderProfile,
  type MedicalRecordContent
} from "@db/schema";

const router = Router();

// Get provider profile
router.get("/profile", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const profile = await db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, req.user!.id),
      with: {
        user: true
      }
    });

    if (!profile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    res.status(500).json({ message: "Failed to fetch provider profile" });
  }
});

// Get provider's patients
router.get("/patients", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const patients = await db.query.patientProfiles.findMany({
      where: eq(patientProfiles.providerId, req.user!.id),
      orderBy: [desc(patientProfiles.updatedAt)],
      with: {
        user: true
      }
    });

    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

// Get all medical records for a provider's patients
router.get("/records", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const records = await db.query.medicalRecords.findMany({
      where: eq(medicalRecords.providerId, req.user!.id),
      orderBy: [desc(medicalRecords.visitDate)],
      with: {
        patient: true
      }
    });

    // Transform records to include patient name
    const transformedRecords = records.map(record => ({
      id: record.id,
      patientId: record.patientId,
      patientName: `${record.patient.firstName} ${record.patient.lastName}`,
      type: record.type,
      visitDate: record.visitDate,
      content: record.content as MedicalRecordContent,
      createdAt: record.createdAt
    }));

    res.json(transformedRecords);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
});

// Get medical records for a specific patient
router.get("/records/:patientId", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    // First verify this patient belongs to the provider
    const patient = await db.query.patientProfiles.findFirst({
      where: and(
        eq(patientProfiles.userId, parseInt(req.params.patientId)),
        eq(patientProfiles.providerId, req.user!.id)
      )
    });

    if (!patient) {
      return res.status(403).json({ message: "Access denied to these medical records" });
    }

    const records = await db.query.medicalRecords.findMany({
      where: eq(medicalRecords.patientId, parseInt(req.params.patientId)),
      orderBy: [desc(medicalRecords.visitDate)]
    });

    res.json(records);
  } catch (error) {
    console.error("Error fetching patient medical records:", error);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
});

// Add new medical record
router.post("/records", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const { patientId, type, content } = req.body;

    // Verify provider has access to this patient
    const patient = await db.query.patientProfiles.findFirst({
      where: and(
        eq(patientProfiles.userId, patientId),
        eq(patientProfiles.providerId, req.user!.id)
      )
    });

    if (!patient) {
      return res.status(403).json({ message: "Access denied" });
    }

    const [record] = await db.insert(medicalRecords)
      .values({
        patientId,
        providerId: req.user!.id,
        type,
        visitDate: new Date(),
        content
      })
      .returning();

    res.status(201).json(record);
  } catch (error) {
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Failed to create medical record" });
  }
});

export default router;