import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";

export function registerRoutes(app: Express): Server {
  // Authentication routes
  app.use("/api/auth", authRoutes);

  const httpServer = createServer(app);

  return httpServer;
}