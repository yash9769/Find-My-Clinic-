import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClinicSchema, 
  insertPatientSchema, 
  insertQueueTokenSchema, 
  insertContactRequestSchema,
  insertPatientProfileSchema,
  insertPatientQRCodeSchema,
  insertAmbulanceRequestSchema,
  insertClinicStaffSchema,
  insertQRCodeScanSchema
} from "@shared/schema";

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
        ? Math.round(clinics.reduce((sum, clinic) => sum + (clinic.currentWaitTime || 0), 0) / clinics.length)
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

  // Healthcare System API Routes
  
  // Authentication endpoints
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, password, userType = 'patient' } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user account
      const user = await storage.createUser({ username, password });
      
      // Store user session
      (req as any).session.userId = user.id;
      (req as any).session.userType = userType;
      
      res.status(201).json({ 
        message: "User created successfully", 
        user: { id: user.id, username: user.username },
        userType 
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to create user account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Store user session
      (req as any).session.userId = user.id;
      
      // Check if user is clinic staff
      const clinicStaff = await storage.getClinicStaffByUserId(user.id);
      const userType = clinicStaff ? 'staff' : 'patient';
      (req as any).session.userType = userType;
      
      res.json({ 
        message: "Login successful", 
        user: { id: user.id, username: user.username },
        userType,
        clinicStaff: clinicStaff || null
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/session", (req, res) => {
    if ((req as any).session.userId) {
      res.json({ 
        authenticated: true, 
        userId: (req as any).session.userId,
        userType: (req as any).session.userType || 'patient'
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Patient Profile endpoints
  app.post("/api/patient-profiles", async (req, res) => {
    try {
      if (!(req as any).session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profileData = { ...req.body, userId: (req as any).session.userId };
      const validatedData = insertPatientProfileSchema.parse(profileData);
      const profile = await storage.createPatientProfile(validatedData);
      
      // Generate QR code for the profile
      const qrCodeData = JSON.stringify({
        id: profile.id,
        type: 'patient_profile',
        timestamp: Date.now(),
        version: '1.0'
      });
      
      const qrCode = await storage.createPatientQRCode({
        patientProfileId: profile.id,
        qrCodeData,
        isActive: true
      });
      
      res.status(201).json({ profile, qrCode });
    } catch (error) {
      res.status(400).json({ message: "Failed to create patient profile" });
    }
  });

  app.get("/api/patient-profiles/me", async (req, res) => {
    try {
      if (!(req as any).session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profile = await storage.getPatientProfileByUserId((req as any).session.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      const qrCode = await storage.getActiveQRCodeByProfileId(profile.id);
      res.json({ profile, qrCode });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put("/api/patient-profiles/me", async (req, res) => {
    try {
      if (!(req as any).session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profile = await storage.updatePatientProfileByUserId((req as any).session.userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // QR Code endpoints
  app.get("/api/qr-codes/:profileId", async (req, res) => {
    try {
      const qrCode = await storage.getActiveQRCodeByProfileId(req.params.profileId);
      if (!qrCode) {
        return res.status(404).json({ message: "QR code not found" });
      }
      res.json(qrCode);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch QR code" });
    }
  });

  app.post("/api/qr-codes/scan", async (req, res) => {
    try {
      if (!(req as any).session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { qrCodeData } = req.body;
      
      // Parse QR code data
      let parsedData;
      try {
        parsedData = JSON.parse(qrCodeData);
      } catch {
        return res.status(400).json({ message: "Invalid QR code format" });
      }
      
      if (parsedData.type !== 'patient_profile') {
        return res.status(400).json({ message: "Invalid QR code type" });
      }
      
      // Get patient profile
      const profile = await storage.getPatientProfileById(parsedData.id);
      if (!profile) {
        return res.status(404).json({ message: "Patient profile not found" });
      }
      
      // Get clinic staff info
      const clinicStaff = await storage.getClinicStaffByUserId((req as any).session.userId);
      if (!clinicStaff) {
        return res.status(403).json({ message: "Only clinic staff can scan QR codes" });
      }
      
      // Record the scan
      const qrCode = await storage.getActiveQRCodeByProfileId(profile.id);
      if (qrCode) {
        await storage.recordQRCodeScan({
          qrCodeId: qrCode.id,
          scannedByStaffId: clinicStaff.id,
          clinicId: clinicStaff.clinicId,
          scanResult: 'success',
          scanData: qrCodeData
        });
        
        await storage.incrementQRCodeScanCount(qrCode.id);
      }
      
      res.json({ profile, scanTimestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ message: "Failed to scan QR code" });
    }
  });

  app.post("/api/qr-codes/regenerate", async (req, res) => {
    try {
      if (!(req as any).session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profile = await storage.getPatientProfileByUserId((req as any).session.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      // Deactivate old QR codes
      await storage.deactivateQRCodesByProfileId(profile.id);
      
      // Generate new QR code
      const qrCodeData = JSON.stringify({
        id: profile.id,
        type: 'patient_profile',
        timestamp: Date.now(),
        version: '1.0'
      });
      
      const qrCode = await storage.createPatientQRCode({
        patientProfileId: profile.id,
        qrCodeData,
        isActive: true
      });
      
      res.json(qrCode);
    } catch (error) {
      res.status(500).json({ message: "Failed to regenerate QR code" });
    }
  });

  // Ambulance Request endpoints
  app.post("/api/ambulance-requests", async (req, res) => {
    try {
      const ambulanceData = req.body;
      
      // Add patient profile if user is authenticated
      if ((req as any).session.userId) {
        const profile = await storage.getPatientProfileByUserId((req as any).session.userId);
        if (profile) {
          ambulanceData.patientProfileId = profile.id;
        }
      }
      
      const validatedData = insertAmbulanceRequestSchema.parse(ambulanceData);
      const request = await storage.createAmbulanceRequest(validatedData);
      
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to create ambulance request" });
    }
  });

  app.get("/api/ambulance-requests", async (req, res) => {
    try {
      const requests = await storage.getAmbulanceRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ambulance requests" });
    }
  });

  app.get("/api/ambulance-requests/:id", async (req, res) => {
    try {
      const request = await storage.getAmbulanceRequestById(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Ambulance request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ambulance request" });
    }
  });

  app.put("/api/ambulance-requests/:id/status", async (req, res) => {
    try {
      const { status, estimatedArrival } = req.body;
      const request = await storage.updateAmbulanceRequestStatus(req.params.id, status, estimatedArrival);
      if (!request) {
        return res.status(404).json({ message: "Ambulance request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: "Failed to update ambulance request status" });
    }
  });

  // Clinic Staff endpoints
  app.post("/api/clinic-staff", async (req, res) => {
    try {
      const validatedData = insertClinicStaffSchema.parse(req.body);
      const staff = await storage.createClinicStaff(validatedData);
      res.status(201).json(staff);
    } catch (error) {
      res.status(400).json({ message: "Failed to create clinic staff" });
    }
  });

  app.get("/api/clinic-staff/me", async (req, res) => {
    try {
      if (!(req as any).session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const staff = await storage.getClinicStaffByUserId((req as any).session.userId);
      if (!staff) {
        return res.status(404).json({ message: "Staff profile not found" });
      }
      
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
