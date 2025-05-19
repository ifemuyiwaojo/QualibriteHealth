/**
 * Security Events API Routes
 * 
 * Part of Phase 4 security improvements for Qualibrite Health.
 * These routes provide access to security event logs for administrators
 * to monitor and analyze security-related activities in the system.
 */

import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import { isAdmin } from "../middleware/role-check";
import { db } from "@db";
import { auditLogs } from "@db/schema";
import { desc, eq, and, gte, lte, like } from "drizzle-orm";
import { AppError } from "../lib/error-handler";
import { SecurityEventType, logSecurityAudit } from "../lib/security-audit-logger";

const router = Router();

/**
 * Get security events with optional filtering
 * GET /api/admin/security-events
 */
router.get("/", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const {
      severity,
      eventType,
      startDate,
      endDate,
      userId,
      resourceType,
      limit = 100,
      offset = 0,
    } = req.query;

    // Log the security audit query for compliance
    await logSecurityAudit(
      SecurityEventType.PHI_ACCESS,
      "Security events accessed",
      {
        userId: req.session.userId,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        sessionId: req.session.id,
        outcome: "success",
        details: {
          queryParams: req.query,
        },
      }
    );

    // Build query conditions
    let conditions = [];

    if (severity) {
      conditions.push(eq(auditLogs.severity, severity as string));
    }

    if (eventType) {
      conditions.push(eq(auditLogs.event_type, eventType as string));
    }

    if (startDate) {
      const startDateObj = new Date(startDate as string);
      conditions.push(gte(auditLogs.timestamp, startDateObj));
    }

    if (endDate) {
      const endDateObj = new Date(endDate as string);
      conditions.push(lte(auditLogs.timestamp, endDateObj));
    }

    if (userId) {
      conditions.push(eq(auditLogs.userId, parseInt(userId as string)));
    }

    if (resourceType) {
      conditions.push(eq(auditLogs.resource_type, resourceType as string));
    }

    // Execute query with all conditions
    const query = conditions.length > 0
      ? db.select().from(auditLogs).where(and(...conditions))
      : db.select().from(auditLogs);

    // Add pagination and sorting
    const events = await query
      .orderBy(desc(auditLogs.timestamp))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Transform results to match frontend expected format
    const transformedEvents = events.map(event => ({
      id: event.id,
      eventType: event.event_type,
      severity: event.severity,
      message: event.message,
      userId: event.userId,
      targetUserId: event.target_user_id,
      resourceType: event.resource_type,
      resourceId: event.resource_id,
      timestamp: event.timestamp.toISOString(),
      ipAddress: event.ipAddress,
      outcome: event.outcome,
      details: event.details
    }));

    res.json(transformedEvents);
  } catch (error) {
    next(new AppError("Failed to retrieve security events", 500));
  }
});

/**
 * Get a summary of security events (counts by type and severity)
 * GET /api/admin/security-events/summary
 */
router.get("/summary", isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    // Use SQL for more complex aggregation query
    const [severityCounts, eventTypeCounts] = await Promise.all([
      // Count by severity
      db.execute(
        db.select({
          severity: auditLogs.severity,
          count: db.fn.count(auditLogs.id)
        })
        .from(auditLogs)
        .groupBy(auditLogs.severity)
      ),
      
      // Count by event type
      db.execute(
        db.select({
          eventType: auditLogs.event_type,
          count: db.fn.count(auditLogs.id)
        })
        .from(auditLogs)
        .groupBy(auditLogs.event_type)
      )
    ]);

    // Calculate recent events (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentEvents = await db.select()
      .from(auditLogs)
      .where(gte(auditLogs.timestamp, yesterday))
      .orderBy(desc(auditLogs.timestamp));

    res.json({
      severityCounts,
      eventTypeCounts,
      recentEvents: recentEvents.length,
      criticalEvents: recentEvents.filter(e => e.severity === 'CRITICAL').length
    });
  } catch (error) {
    next(new AppError("Failed to retrieve security events summary", 500));
  }
});

export default router;