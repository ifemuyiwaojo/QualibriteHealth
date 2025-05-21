/**
 * ApiAdapter Interface
 * 
 * This interface defines the contract that all API service adapters must implement.
 * It allows the application to easily switch between different providers (TherapyNotes, VSee, etc.)
 * without changing the core application logic.
 */

// Common appointment interface that works across different providers
export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  scheduledTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed';
  visitType: string;
  location: string;
  notes?: string;
}

// Common patient record interface
export interface PatientRecord {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  type: string;
  title: string;
  content: string;
}

// Common medication interface
export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  refills: number;
}

// Base adapter interface that all provider adapters must implement
export interface ApiAdapter {
  // Authentication
  initialize(config: any): Promise<void>;
  isAuthenticated(): boolean;
  
  // Appointments
  getAppointments(patientId: string): Promise<Appointment[]>;
  scheduleAppointment(appointmentData: Partial<Appointment>): Promise<Appointment>;
  cancelAppointment(appointmentId: string): Promise<boolean>;
  rescheduleAppointment(appointmentId: string, newTime: string): Promise<Appointment>;
  
  // Medical Records
  getPatientRecords(patientId: string, type?: string): Promise<PatientRecord[]>;
  
  // Medications
  getMedications(patientId: string): Promise<Medication[]>;
  requestRefill(medicationId: string): Promise<boolean>;
  
  // Provider information
  getProviders(): Promise<any[]>;
  
  // Telehealth
  startTelehealthSession(appointmentId: string): Promise<{url: string, token?: string}>;
}