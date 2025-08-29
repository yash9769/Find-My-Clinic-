import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clinics = pgTable("clinics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  currentWaitTime: integer("current_wait_time").default(0),
  queueSize: integer("queue_size").default(0),
  status: text("status").notNull().default("open"), // open, busy, closed
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const queueTokens = pgTable("queue_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clinicId: varchar("clinic_id").references(() => clinics.id).notNull(),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  tokenNumber: integer("token_number").notNull(),
  status: text("status").notNull().default("waiting"), // waiting, called, completed, cancelled
  estimatedWaitTime: integer("estimated_wait_time"),
  createdAt: timestamp("created_at").defaultNow(),
  calledAt: timestamp("called_at"),
  completedAt: timestamp("completed_at"),
});

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // clinic_demo, patient_signup, general
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  clinicName: text("clinic_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Extended tables for healthcare system
export const patientProfiles = pgTable("patient_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  bloodType: text("blood_type"),
  allergies: text("allergies"),
  medications: text("medications"),
  medicalConditions: text("medical_conditions"),
  insuranceProvider: text("insurance_provider"),
  insurancePolicyNumber: text("insurance_policy_number"),
  preferredLanguage: text("preferred_language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patientQRCodes = pgTable("patient_qr_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientProfileId: varchar("patient_profile_id").references(() => patientProfiles.id).notNull(),
  qrCodeData: text("qr_code_data").notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  lastScannedAt: timestamp("last_scanned_at"),
  scanCount: integer("scan_count").default(0),
});

export const ambulanceRequests = pgTable("ambulance_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientProfileId: varchar("patient_profile_id").references(() => patientProfiles.id),
  emergencyType: text("emergency_type").notNull(),
  urgencyLevel: text("urgency_level").notNull(), // critical, urgent, semi-urgent
  patientName: text("patient_name").notNull(),
  patientAge: text("patient_age").notNull(),
  contactPhone: text("contact_phone").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  destinationHospital: text("destination_hospital"),
  symptoms: text("symptoms").notNull(),
  specialRequirements: text("special_requirements"),
  hasInsurance: text("has_insurance").notNull(),
  insuranceProvider: text("insurance_provider"),
  status: text("status").notNull().default("requested"), // requested, dispatched, en_route, arrived, completed, cancelled
  estimatedArrival: text("estimated_arrival"),
  dispatchedAt: timestamp("dispatched_at"),
  arrivedAt: timestamp("arrived_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clinicStaff = pgTable("clinic_staff", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  clinicId: varchar("clinic_id").references(() => clinics.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(), // receptionist, nurse, doctor, admin
  email: text("email").notNull(),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qrCodeScans = pgTable("qr_code_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  qrCodeId: varchar("qr_code_id").references(() => patientQRCodes.id).notNull(),
  scannedByStaffId: varchar("scanned_by_staff_id").references(() => clinicStaff.id).notNull(),
  clinicId: varchar("clinic_id").references(() => clinics.id).notNull(),
  scanResult: text("scan_result").notNull(), // success, error, expired
  scanData: text("scan_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClinicSchema = createInsertSchema(clinics).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertQueueTokenSchema = createInsertSchema(queueTokens).omit({
  id: true,
  createdAt: true,
  calledAt: true,
  completedAt: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
});

// Zod schemas for new healthcare tables
export const insertPatientProfileSchema = createInsertSchema(patientProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientQRCodeSchema = createInsertSchema(patientQRCodes).omit({
  id: true,
  createdAt: true,
  lastScannedAt: true,
  scanCount: true,
});

export const insertAmbulanceRequestSchema = createInsertSchema(ambulanceRequests).omit({
  id: true,
  createdAt: true,
  dispatchedAt: true,
  arrivedAt: true,
  completedAt: true,
});

export const insertClinicStaffSchema = createInsertSchema(clinicStaff).omit({
  id: true,
  createdAt: true,
});

export const insertQRCodeScanSchema = createInsertSchema(qrCodeScans).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type Clinic = typeof clinics.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertQueueToken = z.infer<typeof insertQueueTokenSchema>;
export type QueueToken = typeof queueTokens.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;

// Types for new healthcare tables
export type InsertPatientProfile = z.infer<typeof insertPatientProfileSchema>;
export type PatientProfile = typeof patientProfiles.$inferSelect;
export type InsertPatientQRCode = z.infer<typeof insertPatientQRCodeSchema>;
export type PatientQRCode = typeof patientQRCodes.$inferSelect;
export type InsertAmbulanceRequest = z.infer<typeof insertAmbulanceRequestSchema>;
export type AmbulanceRequest = typeof ambulanceRequests.$inferSelect;
export type InsertClinicStaff = z.infer<typeof insertClinicStaffSchema>;
export type ClinicStaff = typeof clinicStaff.$inferSelect;
export type InsertQRCodeScan = z.infer<typeof insertQRCodeScanSchema>;
export type QRCodeScan = typeof qrCodeScans.$inferSelect;
