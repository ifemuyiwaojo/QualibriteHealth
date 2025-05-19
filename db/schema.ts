import { pgTable, text, serial, integer, boolean, timestamp, jsonb, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Users (Base table for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { 
    enum: [
      "patient", 
      "provider", 
      "admin", 
      "practice_manager", 
      "billing", 
      "intake_coordinator", 
      "it_support", 
      "marketing"
    ] 
  }).notNull(),
  isSuperadmin: boolean("is_superadmin").default(false),
  changePasswordRequired: boolean("change_password_required").default(false),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  // MFA-related fields for Phase 2 security improvements
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: text("mfa_secret"),
  mfaBackupCodes: jsonb("mfa_backup_codes"),
  
  // User profile and additional fields
  metadata: jsonb("metadata").default({}).notNull(),
  emailVerified: boolean("email_verified").default(false),
  
  // Account security and lockout fields
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lastFailedLogin: timestamp("last_failed_login"),
  accountLocked: boolean("account_locked").default(false),
  lockExpiresAt: timestamp("lock_expires_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient Profiles
export const patientProfiles = pgTable("patient_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => providerProfiles.id).notNull(), // Fix: Reference provider_profiles instead of users
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  phone: text("phone"),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  insuranceInfo: jsonb("insurance_info"),
  medicalHistory: jsonb("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Provider Profiles
export const providerProfiles = pgTable("provider_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  title: text("title").notNull(),
  specialization: text("specialization").notNull(),
  npi: text("npi").unique(),
  phone: text("phone"),
  address: text("address"),
  credentials: jsonb("credentials"),
  availability: jsonb("availability"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical Records
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patientProfileId: integer("patient_profile_id").references(() => patientProfiles.id),
  providerProfileId: integer("provider_profile_id").references(() => providerProfiles.id),
  type: varchar("type", { length: 50 }).notNull(),
  visitDate: timestamp("visit_date").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Staff Profiles - Base table with common fields for all staff roles
export const staffProfiles = pgTable("staff_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  hireDate: timestamp("hire_date"),
  department: text("department").notNull(),
  supervisor: integer("supervisor_id").references(() => staffProfiles.id),
  status: text("status", { enum: ["active", "on_leave", "terminated"] }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Practice Manager Profile (specific data for practice managers)
export const practiceManagerProfiles = pgTable("practice_manager_profiles", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").references(() => staffProfiles.id).notNull().unique(),
  managementCertifications: jsonb("management_certifications"),
  managementAreas: jsonb("management_areas"),
  responsibilities: jsonb("responsibilities"),
});

// Billing/RCM Profile
export const billingProfiles = pgTable("billing_profiles", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").references(() => staffProfiles.id).notNull().unique(),
  billingCertifications: jsonb("billing_certifications"),
  insuranceSpecialties: jsonb("insurance_specialties"),
  billingSystemAccess: jsonb("billing_system_access"),
});

// Intake Coordinator Profile
export const intakeCoordinatorProfiles = pgTable("intake_coordinator_profiles", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").references(() => staffProfiles.id).notNull().unique(),
  intakeCertifications: jsonb("intake_certifications"),
  languages: jsonb("languages"),
  schedulingAccess: boolean("scheduling_access").default(true),
});

// IT / Telehealth Support Profile
export const itSupportProfiles = pgTable("it_support_profiles", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").references(() => staffProfiles.id).notNull().unique(),
  techCertifications: jsonb("tech_certifications"),
  systemAccess: jsonb("system_access"),
  supportAreas: jsonb("support_areas"),
});

// Marketing & Community Outreach Profile
export const marketingProfiles = pgTable("marketing_profiles", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").references(() => staffProfiles.id).notNull().unique(),
  marketingCertifications: jsonb("marketing_certifications"),
  specialtyAreas: jsonb("specialty_areas"),
  communityConnections: jsonb("community_connections"),
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => users.id).notNull(),
  dateTime: timestamp("date_time").notNull(),
  status: text("status", { enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"] }).notNull(),
  type: text("type", { enum: ["initial", "follow_up", "medication_check", "telehealth", "emergency"] }).notNull(),
  notes: text("notes"),
  coordinatorId: integer("coordinator_id").references(() => staffProfiles.id),
  billingStatus: text("billing_status", { enum: ["unbilled", "billed", "paid", "denied", "appealed"] }),
  telehealthLink: text("telehealth_link"),
  supportAssignedId: integer("support_assigned_id").references(() => staffProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit Logs (HIPAA Compliance)
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: integer("resource_id").notNull(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Define relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  patientProfile: one(patientProfiles, {
    fields: [users.id],
    references: [patientProfiles.userId],
  }),
  providerProfile: one(providerProfiles, {
    fields: [users.id],
    references: [providerProfiles.userId],
  }),
  providedMedicalRecords: many(medicalRecords, { relationName: "provider_records" }),
  receivedMedicalRecords: many(medicalRecords, { relationName: "patient_records" }),
}));

export const patientProfilesRelations = relations(patientProfiles, ({ one }) => ({
  user: one(users, {
    fields: [patientProfiles.userId],
    references: [users.id],
  }),
  provider: one(providerProfiles, { // Fix: Reference provider_profiles
    fields: [patientProfiles.providerId],
    references: [providerProfiles.id],
  }),
}));

export const providerProfilesRelations = relations(providerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [providerProfiles.userId],
    references: [users.id],
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  patientProfile: one(patientProfiles, {
    fields: [medicalRecords.patientProfileId],
    references: [patientProfiles.id],
    relationName: "patient_medical_records",
  }),
  providerProfile: one(providerProfiles, {
    fields: [medicalRecords.providerProfileId],
    references: [providerProfiles.id],
    relationName: "provider_medical_records",
  }),
}));

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertPatientProfileSchema = createInsertSchema(patientProfiles);
export const selectPatientProfileSchema = createSelectSchema(patientProfiles);
export const insertProviderProfileSchema = createInsertSchema(providerProfiles);
export const selectProviderProfileSchema = createSelectSchema(providerProfiles);
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords);
export const selectMedicalRecordSchema = createSelectSchema(medicalRecords);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const selectAppointmentSchema = createSelectSchema(appointments);


// Type definitions
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect & {
  mfaEnabled?: boolean;
  mfaSecret?: string | null;
  mfaBackupCodes?: Record<string, any> | null;
};
export type InsertPatientProfile = typeof patientProfiles.$inferInsert;
export type SelectPatientProfile = typeof patientProfiles.$inferSelect;
export type InsertProviderProfile = typeof providerProfiles.$inferInsert;
export type SelectProviderProfile = typeof providerProfiles.$inferSelect;
export type InsertMedicalRecord = typeof medicalRecords.$inferInsert;
export type SelectMedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
export type SelectAppointment = typeof appointments.$inferSelect;

// Record types
export type MedicalRecordType = 'diagnosis' | 'prescription' | 'lab_result' | 'progress_note';

// Content types
export type MedicalRecordContent = {
  summary: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  vitals?: Record<string, string>;
  follow_up?: string;
};