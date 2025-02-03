import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import telehealthRoutes from "./routes/telehealth";
import patientRoutes from "./routes/patient";

export function registerRoutes(app: Express): Server {
  // Authentication routes
  app.use("/api/auth", authRoutes);

  // Telehealth routes
  app.use("/api/telehealth", telehealthRoutes);

  // Patient routes
  app.use("/api/patient", patientRoutes);

  const httpServer = createServer(app);

  return httpServer;
}