import { Router } from "express";
import { db } from "@db";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { eq, and, desc, sql } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";
import {
  users,
  patientProfiles,
  medicalRecords,
  providerProfiles,
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
    const provider = await db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, req.user!.id),
    });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const patients = await db
      .select({
        id: patientProfiles.id,
        firstName: patientProfiles.firstName,
        lastName: patientProfiles.lastName,
        dateOfBirth: patientProfiles.dateOfBirth,
        phone: patientProfiles.phone,
        address: patientProfiles.address,
        email: users.email,
      })
      .from(patientProfiles)
      .innerJoin(users, eq(users.id, patientProfiles.userId))
      .where(eq(patientProfiles.providerId, provider.id));

    console.log('Provider ID:', provider.id);
    console.log('Found patients:', patients);

    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
});

// Get all medical records for a provider's patients
router.get("/records", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const provider = await db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, req.user!.id),
    });

    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    const records = await db
      .select({
        id: medicalRecords.id,
        patientId: medicalRecords.patientId,
        type: medicalRecords.type,
        visitDate: medicalRecords.visitDate,
        content: medicalRecords.content,
        createdAt: medicalRecords.createdAt,
        patientName: sql<string>`concat(${patientProfiles.firstName}, ' ', ${patientProfiles.lastName})`.as('patientName'),
      })
      .from(medicalRecords)
      .innerJoin(patientProfiles, eq(patientProfiles.id, medicalRecords.patientId))
      .where(eq(medicalRecords.providerId, provider.id))
      .orderBy(desc(medicalRecords.visitDate));

    console.log('Provider ID:', provider.id);
    console.log('Found records:', records);

    res.json(records);
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
      where: and(
        eq(medicalRecords.patientId, parseInt(req.params.patientId)),
        eq(medicalRecords.providerId, req.user!.id)
      ),
      orderBy: [desc(medicalRecords.visitDate)]
    });

    res.json(records);
  } catch (error) {
    console.error("Error fetching patient medical records:", error);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
});

export default router;