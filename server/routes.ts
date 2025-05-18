import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import telehealthRoutes from "./routes/telehealth";
import providerRoutes from "./routes/provider";
import { csrfProtection, setCsrfToken } from "./middleware/csrf";
import { limitAPI, limitAuth } from "./middleware/rate-limiter";

export function registerRoutes(app: Express): Server {
  // Applying security measures with proper configuration
  // Authentication routes - without CSRF for initial login
  app.use("/api/auth", authRoutes);

  // Telehealth routes (sensitive medical data) - apply general API rate limiting
  app.use("/api/telehealth", limitAPI, telehealthRoutes);

  // Provider routes (sensitive patient info) - apply general API rate limiting
  app.use("/api/provider", limitAPI, providerRoutes);

  const httpServer = createServer(app);

  return httpServer;
}