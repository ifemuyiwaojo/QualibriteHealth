import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import telehealthRoutes from "./routes/telehealth";
import providerRoutes from "./routes/provider";
import { csrfProtection, setCsrfToken } from "./middleware/csrf";
import { limitAPI, limitAuth } from "./middleware/rate-limiter";

export function registerRoutes(app: Express): Server {
  // Set CSRF token for all GET requests to help with client-side setup
  app.get("*", (req, res, next) => {
    setCsrfToken(req, res);
    next();
  });

  // Apply rate limiting and CSRF protection to API routes
  // Authentication routes - apply specific auth rate limiting
  app.use("/api/auth", limitAuth, csrfProtection, authRoutes);

  // Telehealth routes (sensitive medical data) - apply general API rate limiting and CSRF
  app.use("/api/telehealth", limitAPI, csrfProtection, telehealthRoutes);

  // Provider routes (sensitive patient info) - apply general API rate limiting and CSRF
  app.use("/api/provider", limitAPI, csrfProtection, providerRoutes);

  const httpServer = createServer(app);

  return httpServer;
}