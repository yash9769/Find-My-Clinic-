import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClinicSchema, insertPatientSchema, insertQueueTokenSchema, insertContactRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Clinics endpoints
  app.get("/api/clinics", async (req, res) => {
    try {
      const searchQuery = req.query.search as string;
      const clinics = await storage.searchClinics(searchQuery);
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinics" });
    }
  });

  app.get("/api/clinics/:id", async (req, res) => {
    try {
      const clinic = await storage.getClinic(req.params.id);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinic" });
    }
  });

  app.post("/api/clinics", async (req, res) => {
    try {
      const validatedData = insertClinicSchema.parse(req.body);
      const clinic = await storage.createClinic(validatedData);
      res.status(201).json(clinic);
    } catch (error) {
      res.status(400).json({ message: "Invalid clinic data" });
    }
  });

  // Patients endpoints
  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      
      // Check if patient already exists by phone
      const existingPatient = await storage.getPatientByPhone(validatedData.phone);
      if (existingPatient) {
        return res.json(existingPatient);
      }
      
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      res.status(400).json({ message: "Invalid patient data" });
    }
  });

  // Queue management endpoints
  app.get("/api/clinics/:clinicId/queue", async (req, res) => {
    try {
      const tokens = await storage.getQueueTokens(req.params.clinicId);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch queue" });
    }
  });

  app.post("/api/clinics/:clinicId/queue", async (req, res) => {
    try {
      const { patientId, estimatedWaitTime } = req.body;
      const clinicId = req.params.clinicId;
      
      // Verify clinic exists
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      // Get next token number
      const tokenNumber = await storage.getNextTokenNumber(clinicId);
      
      const tokenData = {
        clinicId,
        patientId,
        tokenNumber,
        estimatedWaitTime: estimatedWaitTime || clinic.currentWaitTime,
        status: "waiting" as const
      };
      
      const validatedData = insertQueueTokenSchema.parse(tokenData);
      const token = await storage.createQueueToken(validatedData);
      
      res.status(201).json(token);
    } catch (error) {
      res.status(400).json({ message: "Failed to create queue token" });
    }
  });

  // Contact requests endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const request = await storage.createContactRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact request data" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const requests = await storage.getContactRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact requests" });
    }
  });

  // Stats endpoint for homepage
  app.get("/api/stats", async (req, res) => {
    try {
      const clinics = await storage.getClinics();
      const allTokens = await Promise.all(
        clinics.map(clinic => storage.getQueueTokens(clinic.id))
      );
      
      const totalTokens = allTokens.flat().length;
      const avgWaitTime = clinics.length > 0 
        ? Math.round(clinics.reduce((sum, clinic) => sum + clinic.currentWaitTime, 0) / clinics.length)
        : 0;
      
      res.json({
        clinicsConnected: clinics.length,
        patientsServed: totalTokens,
        avgTimeSaved: `${Math.max(120 - avgWaitTime, 0)} min` // Mock calculation
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
