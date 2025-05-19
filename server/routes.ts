import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import telehealthRoutes from "./routes/telehealth";
import providerRoutes from "./routes/provider";
import setupRoutes from "./routes/setup";
import adminRoutes from "./routes/admin";
import mfaRoutes from "./routes/mfa";
import mobileAuthRoutes from "./routes/mobile-auth";
import { csrfProtection, setCsrfToken } from "./middleware/csrf";
import { limitAPI, limitAuth } from "./middleware/rate-limiter";

export function registerRoutes(app: Express): Server {
  // Setup routes - unprotected to allow initial admin setup
  app.use("/api/setup", setupRoutes);
  
  // Authentication routes - without CSRF for initial login
  app.use("/api/auth", authRoutes);

  // Telehealth routes (sensitive medical data) - apply general API rate limiting
  app.use("/api/telehealth", limitAPI, telehealthRoutes);

  // Provider routes (sensitive patient info) - apply general API rate limiting
  app.use("/api/provider", limitAPI, providerRoutes);
  
  // Create CSRF token middleware that just sets the token
  app.use((req, res, next) => {
    setCsrfToken(req, res);
    next();
  });

  // Admin routes for superadmin-only functionality - apply rate limiting as protection
  app.use("/api/admin", limitAPI, adminRoutes);
  
  // MFA routes for enhanced security - apply rate limiting for protection
  app.use("/api/mfa", limitAPI, mfaRoutes);
  
  // Mobile authentication routes - with rate limiting
  app.use("/api/mobile", limitAPI, mobileAuthRoutes);

  const httpServer = createServer(app);

  return httpServer;
}