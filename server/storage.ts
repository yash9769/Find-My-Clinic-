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
      // South Mumbai
      { id: randomUUID(), name: "Apollo Clinic", address: "Fort, South Mumbai", phone: "+91 98765 00001", email: "fort@apolloclinic.com", latitude: "18.9400", longitude: "72.8350", currentWaitTime: 12, queueSize: 5, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Breach Candy Hospital", address: "Breach Candy, Mumbai", phone: "+91 98765 00002", email: "info@breachcandy.com", latitude: "18.9733", longitude: "72.8078", currentWaitTime: 30, queueSize: 18, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Jaslok Hospital", address: "Pedder Road, Mumbai", phone: "+91 98765 00003", email: "contact@jaslok.com", latitude: "18.9733", longitude: "72.8114", currentWaitTime: 25, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Colaba Health Center", address: "Colaba Causeway, Mumbai", phone: "+91 98765 00004", email: "care@colabaclinic.com", latitude: "18.9067", longitude: "72.8147", currentWaitTime: 8, queueSize: 3, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Marine Drive Clinic", address: "Marine Drive, Mumbai", phone: "+91 98765 00005", email: "info@marineclinic.com", latitude: "18.9558", longitude: "72.8080", currentWaitTime: 15, queueSize: 7, status: "open", isActive: true, createdAt: new Date() },
      
      // Central Mumbai
      { id: randomUUID(), name: "King Edward Memorial Hospital", address: "Parel, Mumbai", phone: "+91 98765 00006", email: "info@kem.com", latitude: "19.0330", longitude: "72.8440", currentWaitTime: 40, queueSize: 25, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Tata Memorial Hospital", address: "Parel, Mumbai", phone: "+91 98765 00007", email: "contact@tmc.com", latitude: "19.0144", longitude: "72.8479", currentWaitTime: 60, queueSize: 45, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "BYL Nair Hospital", address: "Mumbai Central", phone: "+91 98765 00008", email: "info@nair.com", latitude: "18.9692", longitude: "72.8206", currentWaitTime: 35, queueSize: 20, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Matunga Medical Center", address: "Matunga East, Mumbai", phone: "+91 98765 00009", email: "care@matungaclinic.com", latitude: "19.0270", longitude: "72.8570", currentWaitTime: 18, queueSize: 9, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Dadar Clinic", address: "Dadar West, Mumbai", phone: "+91 98765 00010", email: "info@dadarclinic.com", latitude: "19.0178", longitude: "72.8478", currentWaitTime: 20, queueSize: 11, status: "open", isActive: true, createdAt: new Date() },
      
      // Bandra Area
      { id: randomUUID(), name: "Bandra General Clinic", address: "SV Road, Bandra West, Mumbai", phone: "+91 98765 00011", email: "info@bandrageneralclinic.com", latitude: "19.0596", longitude: "72.8295", currentWaitTime: 15, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Lilavati Hospital", address: "Bandra West, Mumbai", phone: "+91 98765 00012", email: "info@lilavati.com", latitude: "19.0507", longitude: "72.8311", currentWaitTime: 45, queueSize: 30, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Hill Road Medical Center", address: "Hill Road, Bandra West", phone: "+91 98765 00013", email: "care@hillroadclinic.com", latitude: "19.0544", longitude: "72.8181", currentWaitTime: 10, queueSize: 4, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Linking Road Clinic", address: "Linking Road, Bandra West", phone: "+91 98765 00014", email: "info@linkingclinic.com", latitude: "19.0554", longitude: "72.8268", currentWaitTime: 22, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Bandra Reclamation Hospital", address: "Bandra Reclamation, Mumbai", phone: "+91 98765 00015", email: "contact@bandrarec.com", latitude: "19.0608", longitude: "72.8228", currentWaitTime: 28, queueSize: 16, status: "busy", isActive: true, createdAt: new Date() },
      
      // Khar & Santacruz
      { id: randomUUID(), name: "Khar Medical Center", address: "Linking Road, Khar West", phone: "+91 98765 00016", email: "info@kharclinic.com", latitude: "19.0728", longitude: "72.8342", currentWaitTime: 14, queueSize: 6, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Santacruz Family Clinic", address: "SV Road, Santacruz West", phone: "+91 98765 00017", email: "care@santacruzclinic.com", latitude: "19.0896", longitude: "72.8388", currentWaitTime: 19, queueSize: 10, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Nanavati Hospital", address: "Vile Parle West, Mumbai", phone: "+91 98765 00018", email: "info@nanavati.com", latitude: "19.1075", longitude: "72.8263", currentWaitTime: 50, queueSize: 35, status: "busy", isActive: true, createdAt: new Date() },
      
      // Andheri West
      { id: randomUUID(), name: "Andheri MedCare Center", address: "JP Road, Andheri West, Mumbai", phone: "+91 98765 00019", email: "contact@andherimedcare.com", latitude: "19.1136", longitude: "72.8697", currentWaitTime: 26, queueSize: 15, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kokilaben Dhirubhai Ambani Hospital", address: "Four Bunglows, Andheri West", phone: "+91 98765 00020", email: "info@kokilaben.com", latitude: "19.1197", longitude: "72.8289", currentWaitTime: 55, queueSize: 40, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Oshiwara Clinic", address: "Oshiwara, Andheri West", phone: "+91 98765 00021", email: "care@oshiwaraclinic.com", latitude: "19.1467", longitude: "72.8342", currentWaitTime: 12, queueSize: 5, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Lokhandwala Health Center", address: "Lokhandwala Complex, Andheri West", phone: "+91 98765 00022", email: "info@lokhandwalaclinic.com", latitude: "19.1361", longitude: "72.8297", currentWaitTime: 17, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Versova Medical Center", address: "Versova, Andheri West", phone: "+91 98765 00023", email: "contact@versovaclinic.com", latitude: "19.1281", longitude: "72.8142", currentWaitTime: 21, queueSize: 12, status: "open", isActive: true, createdAt: new Date() },
      
      // Andheri East
      { id: randomUUID(), name: "Chakala Clinic", address: "Chakala, Andheri East", phone: "+91 98765 00024", email: "info@chakalaclinic.com", latitude: "19.1136", longitude: "72.8697", currentWaitTime: 16, queueSize: 7, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Marol Medical Center", address: "Marol, Andheri East", phone: "+91 98765 00025", email: "care@marolclinic.com", latitude: "19.1197", longitude: "72.8789", currentWaitTime: 23, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "SEEPZ Hospital", address: "SEEPZ, Andheri East", phone: "+91 98765 00026", email: "info@seepzhospital.com", latitude: "19.1258", longitude: "72.8775", currentWaitTime: 32, queueSize: 19, status: "busy", isActive: true, createdAt: new Date() },
      
      // Juhu & Vile Parle
      { id: randomUUID(), name: "Juhu Beach Clinic", address: "Juhu Tara Road, Mumbai", phone: "+91 98765 00027", email: "info@juhuclinic.com", latitude: "19.1075", longitude: "72.8263", currentWaitTime: 13, queueSize: 6, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Vile Parle Medical Center", address: "Vile Parle East, Mumbai", phone: "+91 98765 00028", email: "contact@vileparle.com", latitude: "19.0975", longitude: "72.8472", currentWaitTime: 18, queueSize: 9, status: "open", isActive: true, createdAt: new Date() },
      
      // Goregaon
      { id: randomUUID(), name: "Goregaon General Hospital", address: "Goregaon West, Mumbai", phone: "+91 98765 00029", email: "info@goregaonclinic.com", latitude: "19.1631", longitude: "72.8500", currentWaitTime: 24, queueSize: 15, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Malad Medical Center", address: "Malad West, Mumbai", phone: "+91 98765 00030", email: "care@maladclinic.com", latitude: "19.1864", longitude: "72.8492", currentWaitTime: 29, queueSize: 17, status: "busy", isActive: true, createdAt: new Date() },
      
      // Borivali
      { id: randomUUID(), name: "Borivali General Clinic", address: "Borivali West, Mumbai", phone: "+91 98765 00031", email: "info@borivaliclinic.com", latitude: "19.2308", longitude: "72.8564", currentWaitTime: 11, queueSize: 4, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kandivali Health Center", address: "Kandivali West, Mumbai", phone: "+91 98765 00032", email: "contact@kandivaliclinic.com", latitude: "19.2081", longitude: "72.8558", currentWaitTime: 20, queueSize: 11, status: "open", isActive: true, createdAt: new Date() },
      
      // Powai & Vikhroli
      { id: randomUUID(), name: "Powai Hospital", address: "Powai, Mumbai", phone: "+91 98765 00033", email: "info@powaihospital.com", latitude: "19.1197", longitude: "72.9056", currentWaitTime: 35, queueSize: 22, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Hiranandani Hospital", address: "Powai, Mumbai", phone: "+91 98765 00034", email: "care@hiranandanihospital.com", latitude: "19.1258", longitude: "72.9069", currentWaitTime: 42, queueSize: 28, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Vikhroli Medical Center", address: "Vikhroli East, Mumbai", phone: "+91 98765 00035", email: "info@vikhrolichospital.com", latitude: "19.1075", longitude: "72.9200", currentWaitTime: 19, queueSize: 10, status: "open", isActive: true, createdAt: new Date() },
      
      // Ghatkopar
      { id: randomUUID(), name: "Ghatkopar General Hospital", address: "Ghatkopar West, Mumbai", phone: "+91 98765 00036", email: "contact@ghatkoparclinic.com", latitude: "19.0864", longitude: "72.9081", currentWaitTime: 27, queueSize: 16, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Rajawadi Hospital", address: "Ghatkopar East, Mumbai", phone: "+91 98765 00037", email: "info@rajawadi.com", latitude: "19.0775", longitude: "72.9081", currentWaitTime: 38, queueSize: 24, status: "busy", isActive: true, createdAt: new Date() },
      
      // Mulund
      { id: randomUUID(), name: "Mulund General Clinic", address: "Mulund West, Mumbai", phone: "+91 98765 00038", email: "care@mulundclinic.com", latitude: "19.1728", longitude: "72.9489", currentWaitTime: 14, queueSize: 6, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Fortis Hospital Mulund", address: "Mulund West, Mumbai", phone: "+91 98765 00039", email: "info@fortismulund.com", latitude: "19.1789", longitude: "72.9489", currentWaitTime: 48, queueSize: 32, status: "busy", isActive: true, createdAt: new Date() },
      
      // Thane
      { id: randomUUID(), name: "Thane Civil Hospital", address: "Thane West, Maharashtra", phone: "+91 98765 00040", email: "info@thanecivil.com", latitude: "19.2183", longitude: "72.9781", currentWaitTime: 33, queueSize: 20, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Jupiter Hospital Thane", address: "Thane, Maharashtra", phone: "+91 98765 00041", email: "contact@jupiterthane.com", latitude: "19.2228", longitude: "72.9633", currentWaitTime: 41, queueSize: 27, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Bethany Hospital", address: "Thane East, Maharashtra", phone: "+91 98765 00042", email: "info@bethanythane.com", latitude: "19.2183", longitude: "72.9781", currentWaitTime: 22, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      
      // Navi Mumbai
      { id: randomUUID(), name: "Vashi General Hospital", address: "Vashi, Navi Mumbai", phone: "+91 98765 00043", email: "info@vashihospital.com", latitude: "19.0761", longitude: "73.0158", currentWaitTime: 25, queueSize: 15, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "MGM Hospital Vashi", address: "Vashi, Navi Mumbai", phone: "+91 98765 00044", email: "contact@mgmvashi.com", latitude: "19.0761", longitude: "73.0200", currentWaitTime: 52, queueSize: 36, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Nerul Medical Center", address: "Nerul, Navi Mumbai", phone: "+91 98765 00045", email: "care@nerulclinic.com", latitude: "19.0330", longitude: "73.0297", currentWaitTime: 16, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Seawoods Hospital", address: "Seawoods, Navi Mumbai", phone: "+91 98765 00046", email: "info@seawoodsclinic.com", latitude: "19.0144", longitude: "73.0200", currentWaitTime: 21, queueSize: 12, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "CBD Belapur Clinic", address: "CBD Belapur, Navi Mumbai", phone: "+91 98765 00047", email: "contact@cbdclinic.com", latitude: "19.0178", longitude: "73.0372", currentWaitTime: 18, queueSize: 9, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kharghar General Hospital", address: "Kharghar, Navi Mumbai", phone: "+91 98765 00048", email: "info@kharghar.com", latitude: "19.0270", longitude: "73.0506", currentWaitTime: 30, queueSize: 18, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Panvel Medical Center", address: "Panvel, Navi Mumbai", phone: "+91 98765 00049", email: "care@panvelclinic.com", latitude: "18.9900", longitude: "73.1197", currentWaitTime: 23, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kamothe Clinic", address: "Kamothe, Navi Mumbai", phone: "+91 98765 00050", email: "info@kamotheclinic.com", latitude: "19.0086", longitude: "73.1069", currentWaitTime: 15, queueSize: 7, status: "open", isActive: true, createdAt: new Date() },
      
      // Additional South Mumbai Clinics
      { id: randomUUID(), name: "Tardeo Medical Center", address: "Tardeo, Mumbai", phone: "+91 98765 00051", email: "contact@tardeoclinic.com", latitude: "18.9678", longitude: "72.8181", currentWaitTime: 19, queueSize: 10, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Grant Road Clinic", address: "Grant Road, Mumbai", phone: "+91 98765 00052", email: "info@grantroadclinic.com", latitude: "18.9636", longitude: "72.8181", currentWaitTime: 17, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Opera House Hospital", address: "Opera House, Mumbai", phone: "+91 98765 00053", email: "care@operahouse.com", latitude: "18.9578", longitude: "72.8181", currentWaitTime: 24, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kemps Corner Medical", address: "Kemps Corner, Mumbai", phone: "+91 98765 00054", email: "info@kempscorner.com", latitude: "18.9636", longitude: "72.8081", currentWaitTime: 28, queueSize: 16, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Malabar Hill Clinic", address: "Malabar Hill, Mumbai", phone: "+91 98765 00055", email: "contact@malabarhillclinic.com", latitude: "18.9558", longitude: "72.8006", currentWaitTime: 22, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      
      // More Central Mumbai
      { id: randomUUID(), name: "Lower Parel Hospital", address: "Lower Parel, Mumbai", phone: "+91 98765 00056", email: "info@lowerparel.com", latitude: "19.0144", longitude: "72.8300", currentWaitTime: 31, queueSize: 19, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Worli Medical Center", address: "Worli, Mumbai", phone: "+91 98765 00057", email: "care@worliclinic.com", latitude: "19.0233", longitude: "72.8181", currentWaitTime: 26, queueSize: 15, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Elphinstone Clinic", address: "Elphinstone Road, Mumbai", phone: "+91 98765 00058", email: "info@elphinstone.com", latitude: "18.9900", longitude: "72.8350", currentWaitTime: 20, queueSize: 11, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Chinchpokli Hospital", address: "Chinchpokli, Mumbai", phone: "+91 98765 00059", email: "contact@chinchpokli.com", latitude: "18.9944", longitude: "72.8300", currentWaitTime: 25, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      
      // More Western Suburbs
      { id: randomUUID(), name: "Mahim Medical Center", address: "Mahim, Mumbai", phone: "+91 98765 00060", email: "info@mahimclinic.com", latitude: "19.0411", longitude: "72.8411", currentWaitTime: 18, queueSize: 9, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Dharavi Health Center", address: "Dharavi, Mumbai", phone: "+91 98765 00061", email: "care@dharaviclinic.com", latitude: "19.0411", longitude: "72.8528", currentWaitTime: 14, queueSize: 6, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Sion Hospital", address: "Sion, Mumbai", phone: "+91 98765 00062", email: "info@sionhospital.com", latitude: "19.0411", longitude: "72.8644", currentWaitTime: 33, queueSize: 20, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kurla Medical Center", address: "Kurla West, Mumbai", phone: "+91 98765 00063", email: "contact@kurlaclinic.com", latitude: "19.0703", longitude: "72.8792", currentWaitTime: 21, queueSize: 12, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Vidyavihar Clinic", address: "Vidyavihar West, Mumbai", phone: "+91 98765 00064", email: "info@vidyaviharclinic.com", latitude: "19.0825", longitude: "72.8969", currentWaitTime: 16, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      
      // Eastern Suburbs
      { id: randomUUID(), name: "Chembur General Hospital", address: "Chembur, Mumbai", phone: "+91 98765 00065", email: "care@chemburhospital.com", latitude: "19.0586", longitude: "72.8969", currentWaitTime: 29, queueSize: 17, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Govandi Medical Center", address: "Govandi, Mumbai", phone: "+91 98765 00066", email: "info@govandiclinic.com", latitude: "19.0486", longitude: "72.9139", currentWaitTime: 23, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Mankhurd Clinic", address: "Mankhurd, Mumbai", phone: "+91 98765 00067", email: "contact@mankhurdclinic.com", latitude: "19.0447", longitude: "72.9342", currentWaitTime: 19, queueSize: 10, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Trombay Hospital", address: "Trombay, Mumbai", phone: "+91 98765 00068", email: "info@trombayhospital.com", latitude: "19.0178", longitude: "72.9442", currentWaitTime: 27, queueSize: 16, status: "open", isActive: true, createdAt: new Date() },
      
      // More Northern Suburbs
      { id: randomUUID(), name: "Bhayandar Medical Center", address: "Bhayandar West, Mumbai", phone: "+91 98765 00069", email: "care@bhayandarclinic.com", latitude: "19.3019", longitude: "72.8550", currentWaitTime: 22, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Mira Road Hospital", address: "Mira Road, Mumbai", phone: "+91 98765 00070", email: "info@miraroadhospital.com", latitude: "19.2811", longitude: "72.8692", currentWaitTime: 35, queueSize: 21, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Dahisar Medical Center", address: "Dahisar East, Mumbai", phone: "+91 98765 00071", email: "contact@dahisarclinic.com", latitude: "19.2583", longitude: "72.8681", currentWaitTime: 17, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Bhayander East Clinic", address: "Bhayander East, Mumbai", phone: "+91 98765 00072", email: "info@bhayandereast.com", latitude: "19.3019", longitude: "72.8653", currentWaitTime: 24, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      
      // Additional Navi Mumbai Clinics
      { id: randomUUID(), name: "Airoli Medical Center", address: "Airoli, Navi Mumbai", phone: "+91 98765 00073", email: "care@airolihospital.com", latitude: "19.1564", longitude: "72.9928", currentWaitTime: 20, queueSize: 11, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Rabale Hospital", address: "Rabale, Navi Mumbai", phone: "+91 98765 00074", email: "info@rabalehospital.com", latitude: "19.1431", longitude: "73.0083", currentWaitTime: 32, queueSize: 19, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Ghansoli Clinic", address: "Ghansoli, Navi Mumbai", phone: "+91 98765 00075", email: "contact@ghansolimedical.com", latitude: "19.1261", longitude: "73.0158", currentWaitTime: 18, queueSize: 9, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kopar Khairane Medical", address: "Kopar Khairane, Navi Mumbai", phone: "+91 98765 00076", email: "info@koparkhairaheclinic.com", latitude: "19.1058", longitude: "73.0025", currentWaitTime: 26, queueSize: 15, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Sanpada Hospital", address: "Sanpada, Navi Mumbai", phone: "+91 98765 00077", email: "care@sanpadahospital.com", latitude: "19.0700", longitude: "73.0081", currentWaitTime: 23, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Juinagar Medical Center", address: "Juinagar, Navi Mumbai", phone: "+91 98765 00078", email: "info@juinagarclinic.com", latitude: "19.0644", longitude: "73.0239", currentWaitTime: 15, queueSize: 7, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Ulwe Hospital", address: "Ulwe, Navi Mumbai", phone: "+91 98765 00079", email: "contact@ulwehospital.com", latitude: "18.9897", longitude: "73.0408", currentWaitTime: 28, queueSize: 16, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Kalamboli Clinic", address: "Kalamboli, Navi Mumbai", phone: "+91 98765 00080", email: "info@kalambolimedical.com", latitude: "19.0297", longitude: "73.1008", currentWaitTime: 21, queueSize: 12, status: "open", isActive: true, createdAt: new Date() },
      
      // Specialized Clinics
      { id: randomUUID(), name: "Mumbai Eye Care", address: "Dadar, Mumbai", phone: "+91 98765 00081", email: "info@eyecare.com", latitude: "19.0178", longitude: "72.8478", currentWaitTime: 12, queueSize: 5, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Heart Care Center", address: "Bandra, Mumbai", phone: "+91 98765 00082", email: "care@heartcenter.com", latitude: "19.0596", longitude: "72.8295", currentWaitTime: 40, queueSize: 25, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Dental Plus", address: "Andheri West, Mumbai", phone: "+91 98765 00083", email: "info@dentalplus.com", latitude: "19.1136", longitude: "72.8697", currentWaitTime: 8, queueSize: 3, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Skin Care Clinic", address: "Juhu, Mumbai", phone: "+91 98765 00084", email: "contact@skincare.com", latitude: "19.1075", longitude: "72.8263", currentWaitTime: 25, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Pediatric Center", address: "Powai, Mumbai", phone: "+91 98765 00085", email: "info@pediatriccare.com", latitude: "19.1197", longitude: "72.9056", currentWaitTime: 18, queueSize: 9, status: "open", isActive: true, createdAt: new Date() },
      
      // Emergency Centers
      { id: randomUUID(), name: "24x7 Emergency Center", address: "Western Express Highway, Mumbai", phone: "+91 98765 00086", email: "emergency@247care.com", latitude: "19.1197", longitude: "72.8500", currentWaitTime: 5, queueSize: 2, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Urgent Care Clinic", address: "Eastern Express Highway, Mumbai", phone: "+91 98765 00087", email: "urgent@care.com", latitude: "19.0825", longitude: "72.8969", currentWaitTime: 7, queueSize: 3, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Quick Medical Center", address: "LBS Marg, Mumbai", phone: "+91 98765 00088", email: "quick@medical.com", latitude: "19.0703", longitude: "72.8792", currentWaitTime: 10, queueSize: 4, status: "open", isActive: true, createdAt: new Date() },
      
      // Community Health Centers
      { id: randomUUID(), name: "Slum Rehabilitation Clinic", address: "Mankhurd, Mumbai", phone: "+91 98765 00089", email: "community@health.com", latitude: "19.0447", longitude: "72.9342", currentWaitTime: 15, queueSize: 7, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Municipal Health Center", address: "Deonar, Mumbai", phone: "+91 98765 00090", email: "municipal@health.com", latitude: "19.0447", longitude: "72.9042", currentWaitTime: 22, queueSize: 13, status: "open", isActive: true, createdAt: new Date() },
      
      // Corporate Health Centers
      { id: randomUUID(), name: "BKC Medical Center", address: "Bandra Kurla Complex, Mumbai", phone: "+91 98765 00091", email: "bkc@corporate.com", latitude: "19.0608", longitude: "72.8639", currentWaitTime: 30, queueSize: 18, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Mindspace Health Center", address: "Malad West, Mumbai", phone: "+91 98765 00092", email: "mindspace@health.com", latitude: "19.1864", longitude: "72.8392", currentWaitTime: 35, queueSize: 21, status: "busy", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "IT Park Medical", address: "Mahape, Navi Mumbai", phone: "+91 98765 00093", email: "itpark@medical.com", latitude: "19.1261", longitude: "73.0239", currentWaitTime: 27, queueSize: 16, status: "open", isActive: true, createdAt: new Date() },
      
      // Transport Hub Clinics
      { id: randomUUID(), name: "Airport Medical Center", address: "Mumbai Airport, Andheri East", phone: "+91 98765 00094", email: "airport@medical.com", latitude: "19.0886", longitude: "72.8681", currentWaitTime: 20, queueSize: 11, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Railway Station Clinic", address: "Mumbai Central Station", phone: "+91 98765 00095", email: "railway@clinic.com", latitude: "18.9692", longitude: "72.8206", currentWaitTime: 16, queueSize: 8, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Bus Depot Medical", address: "BEST Depot, Colaba", phone: "+91 98765 00096", email: "depot@medical.com", latitude: "18.9067", longitude: "72.8147", currentWaitTime: 12, queueSize: 5, status: "open", isActive: true, createdAt: new Date() },
      
      // Final additions to reach 100+
      { id: randomUUID(), name: "Wellness Plus Clinic", address: "Jogeshwari West, Mumbai", phone: "+91 98765 00097", email: "wellness@plus.com", latitude: "19.1397", longitude: "72.8497", currentWaitTime: 19, queueSize: 10, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Family Health Center", address: "Kanjurmarg, Mumbai", phone: "+91 98765 00098", email: "family@health.com", latitude: "19.1258", longitude: "72.9297", currentWaitTime: 24, queueSize: 14, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Community Care Clinic", address: "Dombivli, Mumbai", phone: "+91 98765 00099", email: "community@care.com", latitude: "19.2183", longitude: "73.0867", currentWaitTime: 26, queueSize: 15, status: "open", isActive: true, createdAt: new Date() },
      { id: randomUUID(), name: "Prime Healthcare", address: "Kalyan, Mumbai", phone: "+91 98765 00100", email: "prime@healthcare.com", latitude: "19.2403", longitude: "73.1305", currentWaitTime: 31, queueSize: 19, status: "busy", isActive: true, createdAt: new Date() }
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
    const patient: Patient = { 
      ...insertPatient, 
      id, 
      createdAt: new Date(),
      email: insertPatient.email || null
    };
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
      completedAt: null,
      status: insertToken.status || "waiting",
      estimatedWaitTime: insertToken.estimatedWaitTime || null
    };
    this.queueTokens.set(id, token);
    
    // Update clinic queue size
    const clinic = await this.getClinic(insertToken.clinicId);
    if (clinic) {
      await this.updateClinic(clinic.id, { 
        queueSize: (clinic.queueSize || 0) + 1,
        currentWaitTime: Math.max(clinic.currentWaitTime || 0, token.estimatedWaitTime || 0)
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
      createdAt: new Date(),
      phone: insertRequest.phone || null,
      message: insertRequest.message || null,
      clinicName: insertRequest.clinicName || null
    };
    this.contactRequests.set(id, request);
    return request;
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }
}

export const storage = new MemStorage();
