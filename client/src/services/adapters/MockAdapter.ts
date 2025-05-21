import { ApiAdapter, Appointment, PatientRecord, Medication } from './ApiAdapter';

/**
 * Mock API Adapter for Development and Testing
 * 
 * This adapter implements the ApiAdapter interface with mock data.
 * It's useful for development and testing without requiring actual API credentials.
 */
export class MockAdapter implements ApiAdapter {
  private isInitialized: boolean = false;
  
  // Mock data storage
  private appointments: Appointment[] = [];
  private records: PatientRecord[] = [];
  private medications: Medication[] = [];
  
  constructor() {
    // Pre-populate with some mock data
    this.seedMockData();
  }

  /**
   * Create initial mock data
   */
  private seedMockData() {
    // Mock appointments
    this.appointments = [
      {
        id: '1001',
        patientId: '67',
        providerId: 'provider-1',
        providerName: 'Dr. Sarah Wilson',
        scheduledTime: '2025-05-25T13:00:00Z',
        endTime: '2025-05-25T14:00:00Z',
        status: 'confirmed',
        visitType: 'Follow-up',
        location: 'Video',
        notes: 'Regular follow-up appointment'
      },
      {
        id: '1002',
        patientId: '67',
        providerId: 'provider-1',
        providerName: 'Dr. Sarah Wilson',
        scheduledTime: '2025-06-10T09:30:00Z',
        endTime: '2025-06-10T10:30:00Z',
        status: 'scheduled',
        visitType: 'Medication Review',
        location: 'Office',
        notes: 'Medication review and assessment'
      }
    ];
    
    // Mock patient records
    this.records = [
      {
        id: '501',
        patientId: '67',
        providerId: 'provider-1',
        date: '2025-05-01T10:15:00Z',
        type: 'Progress Note',
        title: 'Monthly Follow-up',
        content: 'Patient reports improved symptoms with current medication. Sleep has improved, and anxiety symptoms have decreased in frequency and intensity.'
      },
      {
        id: '502',
        patientId: '67',
        providerId: 'provider-1',
        date: '2025-04-15T14:30:00Z',
        type: 'Prescription',
        title: 'Medication Adjustment',
        content: 'Adjusted Buspirone dosage to 15mg twice daily based on patient response and side effect profile.'
      }
    ];
    
    // Mock medications
    this.medications = [
      {
        id: '1',
        patientId: '67',
        name: 'Escitalopram',
        dosage: '10mg',
        instructions: 'Take once daily in the morning',
        startDate: '2025-03-01',
        endDate: '2025-09-01',
        refills: 2
      },
      {
        id: '2',
        patientId: '67',
        name: 'Buspirone',
        dosage: '15mg',
        instructions: 'Take twice daily with food',
        startDate: '2025-04-15',
        endDate: '2025-07-15',
        refills: 1
      }
    ];
  }

  /**
   * Initialize the mock adapter
   */
  async initialize(config: any): Promise<void> {
    // For mock adapter, we just simulate a successful initialization
    this.isInitialized = true;
    return Promise.resolve();
  }

  /**
   * Check if the adapter is initialized
   */
  isAuthenticated(): boolean {
    return this.isInitialized;
  }

  /**
   * Get appointments for a specific patient
   */
  async getAppointments(patientId: string): Promise<Appointment[]> {
    // Simulate network delay
    await this.delay(500);
    return this.appointments.filter(a => a.patientId === patientId);
  }

  /**
   * Schedule a new appointment
   */
  async scheduleAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    // Simulate network delay
    await this.delay(800);
    
    const newAppointment: Appointment = {
      id: `mock-${Date.now()}`,
      patientId: appointmentData.patientId || '67',
      providerId: appointmentData.providerId || 'provider-1',
      providerName: appointmentData.providerName || 'Dr. Sarah Wilson',
      scheduledTime: appointmentData.scheduledTime || new Date().toISOString(),
      endTime: appointmentData.endTime || this.addHoursToDate(new Date(appointmentData.scheduledTime || new Date()), 1).toISOString(),
      status: 'scheduled',
      visitType: appointmentData.visitType || 'Follow-up',
      location: appointmentData.location || 'Video',
      notes: appointmentData.notes
    };
    
    // Add to our mock data
    this.appointments.push(newAppointment);
    
    return newAppointment;
  }

  /**
   * Cancel an existing appointment
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    // Simulate network delay
    await this.delay(600);
    
    const appointmentIndex = this.appointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex >= 0) {
      this.appointments[appointmentIndex].status = 'canceled';
      return true;
    }
    
    return false;
  }

  /**
   * Reschedule an existing appointment
   */
  async rescheduleAppointment(appointmentId: string, newTime: string): Promise<Appointment> {
    // Simulate network delay
    await this.delay(700);
    
    const appointmentIndex = this.appointments.findIndex(a => a.id === appointmentId);
    if (appointmentIndex < 0) {
      throw new Error(`Appointment with ID ${appointmentId} not found`);
    }
    
    const appointment = this.appointments[appointmentIndex];
    
    // Calculate new end time based on the original duration
    const originalStartTime = new Date(appointment.scheduledTime);
    const originalEndTime = new Date(appointment.endTime);
    const durationMs = originalEndTime.getTime() - originalStartTime.getTime();
    
    const newStartTime = new Date(newTime);
    const newEndTime = new Date(newStartTime.getTime() + durationMs);
    
    // Update the appointment
    this.appointments[appointmentIndex] = {
      ...appointment,
      scheduledTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString()
    };
    
    return this.appointments[appointmentIndex];
  }

  /**
   * Get patient medical records
   */
  async getPatientRecords(patientId: string, type?: string): Promise<PatientRecord[]> {
    // Simulate network delay
    await this.delay(600);
    
    let filteredRecords = this.records.filter(r => r.patientId === patientId);
    
    if (type) {
      filteredRecords = filteredRecords.filter(r => r.type === type);
    }
    
    return filteredRecords;
  }

  /**
   * Get medications for a patient
   */
  async getMedications(patientId: string): Promise<Medication[]> {
    // Simulate network delay
    await this.delay(500);
    
    return this.medications.filter(m => m.patientId === patientId);
  }

  /**
   * Request medication refill
   */
  async requestRefill(medicationId: string): Promise<boolean> {
    // Simulate network delay
    await this.delay(800);
    
    const medicationIndex = this.medications.findIndex(m => m.id === medicationId);
    if (medicationIndex >= 0) {
      this.medications[medicationIndex].refills += 1;
      return true;
    }
    
    return false;
  }

  /**
   * Get available providers
   */
  async getProviders(): Promise<any[]> {
    // Simulate network delay
    await this.delay(600);
    
    return [
      {
        id: 'provider-1',
        name: 'Dr. Sarah Wilson',
        specialty: 'Psychiatry',
        availability: ['Monday', 'Wednesday', 'Friday']
      },
      {
        id: 'provider-2',
        name: 'Dr. Michael Johnson',
        specialty: 'Clinical Psychology',
        availability: ['Tuesday', 'Thursday']
      }
    ];
  }

  /**
   * Start telehealth session
   */
  async startTelehealthSession(appointmentId: string): Promise<{ url: string; token?: string }> {
    // Simulate network delay
    await this.delay(1000);
    
    return {
      url: 'https://mock-telehealth-session.example.com/session',
      token: 'mock-telehealth-token'
    };
  }

  /**
   * Helper to simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Helper to add hours to a date
   */
  private addHoursToDate(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }
}