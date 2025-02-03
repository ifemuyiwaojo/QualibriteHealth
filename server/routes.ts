import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import telehealthRoutes from "./routes/telehealth";

export function registerRoutes(app: Express): Server {
  // Authentication routes
  app.use("/api/auth", authRoutes);

  // Telehealth routes
  app.use("/api/telehealth", telehealthRoutes);

  const httpServer = createServer(app);

  return httpServer;
}