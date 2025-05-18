import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@db";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./lib/error-handler";
import { securityHeaders } from "./middleware/security-headers";
import { setupSessionActivity } from "./middleware/session-activity";
import { SecretManager } from "./lib/secret-manager";

// Get required secrets using the SecretManager
// This ensures proper validation of environment variables
let SESSION_SECRET: string;
try {
  const secretManager = SecretManager.getInstance();
  SESSION_SECRET = process.env.SESSION_SECRET || secretManager.getCurrentSecret();
  
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set or JWT_SECRET must be available as fallback");
  }
} catch (error) {
  console.error("CRITICAL SECURITY ERROR: Unable to initialize secrets", error);
  process.exit(1); // Exit the application if secret initialization fails
}

// Global rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Apply security headers to all responses
app.use(securityHeaders);

// Setup session store with PostgreSQL
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: 'session', // Will be created automatically
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 15, // Automatically remove expired sessions every 15 min
      // Add additional column encryption for sensitive session data (future enhancement)
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'qbh_session', // Custom name with less revealing information
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      httpOnly: true, // Prevent JavaScript access to cookies (XSS protection)
      maxAge: 2 * 60 * 60 * 1000, // 2 hours default session timeout
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Stricter in production
      path: '/'
    },
    rolling: true, // Reset the cookie expiration time when the user interacts with the site
    unset: 'destroy' // Remove session from store when destroyed
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Apply the global rate limiter to all API routes
  app.use("/api", apiLimiter);
  
  const server = registerRoutes(app);

  // Use our centralized error handler middleware
  app.use(errorHandler);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();