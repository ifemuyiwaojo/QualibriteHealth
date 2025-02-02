import express from "express";
import { z } from "zod";
import { db } from "@db";
import { patients, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { fromZodError } from "zod-validation-error";

const router = express.Router();

// Get patient profile
router.get("/profile", authenticateToken, authorizeRoles("patient"), async (req: any, res) => {
  try {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, req.user.id))
      .leftJoin(users, eq(patients.userId, users.id));

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: "Failed to fetch patient profile" });
  }
});

// Update patient profile
router.patch("/profile", authenticateToken, authorizeRoles("patient"), async (req: any, res) => {
  try {
    const updateSchema = z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      dateOfBirth: z.string(),
      phone: z.string().min(10),
      address: z.string().min(1),
      emergencyContact: z.string().optional(),
      emergencyPhone: z.string().optional(),
    });

    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromZodError(result.error);
      return res.status(400).json({ message: error.message });
    }

    const [updated] = await db
      .update(patients)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(patients.userId, req.user.id))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ message: "Failed to update patient profile" });
  }
});

export default router;
