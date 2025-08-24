import { type User, type InsertUser, type Clinic, type InsertClinic, type Patient, type InsertPatient, type QueueToken, type InsertQueueToken, type ContactRequest, type InsertContactRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Clinics
  getClinics(): Promise<Clinic[]>;
  getClinic(id: string): Promise<Clinic | undefined>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  updateClinic(id: string, updates: Partial<Clinic>): Promise<Clinic | undefined>;
  searchClinics(searchQuery?: string): Promise<Clinic[]>;
  
  // Patients
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByPhone(phone: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  // Queue Tokens
  getQueueTokens(clinicId: string): Promise<QueueToken[]>;
  getQueueToken(id: string): Promise<QueueToken | undefined>;
  createQueueToken(token: InsertQueueToken): Promise<QueueToken>;
  updateQueueToken(id: string, updates: Partial<QueueToken>): Promise<QueueToken | undefined>;
  getNextTokenNumber(clinicId: string): Promise<number>;
  
  // Contact Requests
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clinics: Map<string, Clinic>;
  private patients: Map<string, Patient>;
  private queueTokens: Map<string, QueueToken>;
  private contactRequests: Map<string, ContactRequest>;

  constructor() {
    this.users = new Map();
    this.clinics = new Map();
    this.patients = new Map();
    this.queueTokens = new Map();
    this.contactRequests = new Map();
    
    // Initialize with sample clinics
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleClinics: Clinic[] = [
      {
        id: randomUUID(),
        name: "City General Clinic",
        address: "123 Main St, Downtown",
        phone: "+1 (555) 123-4567",
        email: "info@citygeneralclinic.com",
        latitude: "40.7128",
        longitude: "-74.0060",
        currentWaitTime: 15,
        queueSize: 8,
        status: "open",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "MedCare Center",
        address: "456 Oak Avenue",
        phone: "+1 (555) 234-5678",
        email: "contact@medcarecenter.com",
        latitude: "40.7580",
        longitude: "-73.9855",
        currentWaitTime: 45,
        queueSize: 23,
        status: "busy",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Wellness Family Practice",
        address: "789 Pine Street",
        phone: "+1 (555) 345-6789",
        email: "hello@wellnessfp.com",
        latitude: "40.7282",
        longitude: "-74.0776",
        currentWaitTime: 25,
        queueSize: 12,
        status: "open",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Quick Care Clinic",
        address: "321 Elm Road",
        phone: "+1 (555) 456-7890",
        email: "info@quickcareclinic.com",
        latitude: "40.7387",
        longitude: "-74.0021",
        currentWaitTime: 5,
        queueSize: 3,
        status: "open",
        isActive: true,
        createdAt: new Date(),
      }
    ];

    sampleClinics.forEach(clinic => {
      this.clinics.set(clinic.id, clinic);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getClinics(): Promise<Clinic[]> {
    return Array.from(this.clinics.values()).filter(clinic => clinic.isActive);
  }

  async getClinic(id: string): Promise<Clinic | undefined> {
    return this.clinics.get(id);
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const id = randomUUID();
    const clinic: Clinic = { 
      ...insertClinic, 
      id, 
      createdAt: new Date(),
      currentWaitTime: 0,
      queueSize: 0,
      status: "open",
      isActive: true
    };
    this.clinics.set(id, clinic);
    return clinic;
  }

  async updateClinic(id: string, updates: Partial<Clinic>): Promise<Clinic | undefined> {
    const clinic = this.clinics.get(id);
    if (!clinic) return undefined;
    
    const updatedClinic = { ...clinic, ...updates };
    this.clinics.set(id, updatedClinic);
    return updatedClinic;
  }

  async searchClinics(searchQuery?: string): Promise<Clinic[]> {
    const allClinics = await this.getClinics();
    
    if (!searchQuery) return allClinics;
    
    const query = searchQuery.toLowerCase();
    return allClinics.filter(clinic => 
      clinic.name.toLowerCase().includes(query) ||
      clinic.address.toLowerCase().includes(query)
    );
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByPhone(phone: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(
      (patient) => patient.phone === phone,
    );
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { ...insertPatient, id, createdAt: new Date() };
    this.patients.set(id, patient);
    return patient;
  }

  async getQueueTokens(clinicId: string): Promise<QueueToken[]> {
    return Array.from(this.queueTokens.values()).filter(
      token => token.clinicId === clinicId
    );
  }

  async getQueueToken(id: string): Promise<QueueToken | undefined> {
    return this.queueTokens.get(id);
  }

  async createQueueToken(insertToken: InsertQueueToken): Promise<QueueToken> {
    const id = randomUUID();
    const token: QueueToken = { 
      ...insertToken, 
      id, 
      createdAt: new Date(),
      calledAt: null,
      completedAt: null
    };
    this.queueTokens.set(id, token);
    
    // Update clinic queue size
    const clinic = await this.getClinic(insertToken.clinicId);
    if (clinic) {
      await this.updateClinic(clinic.id, { 
        queueSize: clinic.queueSize + 1,
        currentWaitTime: Math.max(clinic.currentWaitTime, token.estimatedWaitTime || 0)
      });
    }
    
    return token;
  }

  async updateQueueToken(id: string, updates: Partial<QueueToken>): Promise<QueueToken | undefined> {
    const token = this.queueTokens.get(id);
    if (!token) return undefined;
    
    const updatedToken = { ...token, ...updates };
    this.queueTokens.set(id, updatedToken);
    return updatedToken;
  }

  async getNextTokenNumber(clinicId: string): Promise<number> {
    const tokens = await this.getQueueTokens(clinicId);
    if (tokens.length === 0) return 1;
    
    return Math.max(...tokens.map(token => token.tokenNumber)) + 1;
  }

  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const request: ContactRequest = { 
      ...insertRequest, 
      id, 
      createdAt: new Date() 
    };
    this.contactRequests.set(id, request);
    return request;
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }
}

export const storage = new MemStorage();
