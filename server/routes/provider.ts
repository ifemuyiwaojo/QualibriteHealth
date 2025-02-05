import { Router } from "express";
import { db } from "@db";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { eq, and, desc } from "drizzle-orm";
import { AuthRequest } from "../middleware/auth";
import {
  users,
  patientProfiles,
  providerProfiles,
  medicalRecords,
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
    // First get the provider profile ID
    const providerProfile = await db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, req.user!.id),
    });

    if (!providerProfile) {
      console.log('No provider profile found for user:', req.user!.id);
      return res.status(404).json({ message: "Provider profile not found" });
    }

    console.log('Found provider profile:', providerProfile);

    // Get all patients assigned to this provider
    const patients = await db.query.patientProfiles.findMany({
      where: eq(patientProfiles.providerId, providerProfile.id),
      with: {
        user: true
      }
    });

    console.log('Found patients:', patients);

    // Transform the data for the frontend
    const formattedPatients = patients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      phone: patient.phone,
      address: patient.address,
      email: patient.user.email
    }));

    res.json(formattedPatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ 
      message: "Failed to fetch patients", 
      error: (error as Error).message 
    });
  }
});

// Get all medical records
router.get("/records", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const providerProfile = await db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, req.user!.id),
    });

    if (!providerProfile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // Get all medical records for patients assigned to this provider
    const records = await db.query.medicalRecords.findMany({
      where: eq(medicalRecords.providerId, providerProfile.id),
      with: {
        patient: true,
      },
      orderBy: [desc(medicalRecords.visitDate)]
    });

    res.json(records);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ 
      message: "Failed to fetch medical records", 
      error: (error as Error).message 
    });
  }
});

// Get specific patient's medical records
router.get("/records/:patientId", authenticateToken, authorizeRoles("provider"), async (req: AuthRequest, res) => {
  try {
    const providerProfile = await db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, req.user!.id),
    });

    if (!providerProfile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // Verify this patient belongs to the provider
    const patient = await db.query.patientProfiles.findFirst({
      where: and(
        eq(patientProfiles.id, parseInt(req.params.patientId)),
        eq(patientProfiles.providerId, providerProfile.id)
      ),
    });

    if (!patient) {
      return res.status(403).json({ message: "Access denied to these medical records" });
    }

    const records = await db.query.medicalRecords.findMany({
      where: and(
        eq(medicalRecords.patientId, parseInt(req.params.patientId)),
        eq(medicalRecords.providerId, providerProfile.id)
      ),
      orderBy: [desc(medicalRecords.visitDate)]
    });

    res.json(records);
  } catch (error) {
    console.error("Error fetching patient medical records:", error);
    res.status(500).json({ 
      message: "Failed to fetch medical records", 
      error: (error as Error).message 
    });
  }
});

export default router;