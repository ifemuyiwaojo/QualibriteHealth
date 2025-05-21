import { ApiAdapter, Appointment, PatientRecord, Medication } from './ApiAdapter';

/**
 * TherapyNotes API Adapter
 * 
 * Implements the ApiAdapter interface for TherapyNotes-specific API calls.
 * This adapter handles all the translation between our application's data models
 * and TherapyNotes API requirements.
 */
export class TherapyNotesAdapter implements ApiAdapter {
  private baseUrl: string = '';
  private apiKey: string = '';
  private isInitialized: boolean = false;

  /**
   * Initialize the adapter with TherapyNotes API credentials
   */
  async initialize(config: { apiKey: string, baseUrl?: string }): Promise<void> {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.therapynotes.com/v1';
    
    try {
      // Verify credentials work by making a simple API call
      const response = await fetch(`${this.baseUrl}/ping`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        this.isInitialized = true;
      } else {
        throw new Error(`TherapyNotes API authentication failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to initialize TherapyNotes adapter:', error);
      throw error;
    }
  }

  /**
   * Check if the adapter is authenticated with TherapyNotes
   */
  isAuthenticated(): boolean {
    return this.isInitialized;
  }

  /**
   * Helper method to make authenticated requests to TherapyNotes API
   */
  private async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<T> {
    if (!this.isInitialized) {
      throw new Error('TherapyNotes adapter not initialized. Call initialize() first.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `TherapyNotes API error (${response.status}): ${errorData.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`TherapyNotes API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get appointments for a specific patient
   */
  async getAppointments(patientId: string): Promise<Appointment[]> {
    try {
      // TherapyNotes uses a different endpoint structure for appointments
      const data = await this.request<any[]>(`/patients/${patientId}/appointments`);
      
      // Map TherapyNotes data structure to our Appointment interface
      return data.map(item => ({
        id: item.id,
        patientId: patientId,
        providerId: item.clinicianId,
        providerName: item.clinicianName,
        scheduledTime: item.startTime,
        endTime: item.endTime,
        status: this.mapAppointmentStatus(item.status),
        visitType: item.appointmentType,
        location: item.location || 'Online',
        notes: item.notes
      }));
    } catch (error) {
      console.error('Failed to fetch appointments from TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Schedule a new appointment
   */
  async scheduleAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      // Map our data structure to TherapyNotes expected format
      const therapyNotesData = {
        patientId: appointmentData.patientId,
        clinicianId: appointmentData.providerId,
        startTime: appointmentData.scheduledTime,
        duration: this.calculateDuration(appointmentData.scheduledTime, appointmentData.endTime),
        appointmentType: appointmentData.visitType,
        location: appointmentData.location,
        notes: appointmentData.notes
      };

      const response = await this.request<any>(
        '/appointments', 
        'POST', 
        therapyNotesData
      );

      // Return the created appointment in our standard format
      return {
        id: response.id,
        patientId: appointmentData.patientId,
        providerId: appointmentData.providerId,
        providerName: appointmentData.providerName,
        scheduledTime: response.startTime,
        endTime: response.endTime,
        status: this.mapAppointmentStatus(response.status),
        visitType: response.appointmentType,
        location: response.location || 'Online',
        notes: response.notes
      };
    } catch (error) {
      console.error('Failed to schedule appointment with TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Cancel an existing appointment
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      await this.request<void>(
        `/appointments/${appointmentId}/cancel`, 
        'POST',
        { reason: 'Canceled by patient' }
      );
      return true;
    } catch (error) {
      console.error('Failed to cancel appointment with TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Reschedule an existing appointment
   */
  async rescheduleAppointment(appointmentId: string, newTime: string): Promise<Appointment> {
    try {
      const response = await this.request<any>(
        `/appointments/${appointmentId}/reschedule`, 
        'POST',
        { startTime: newTime }
      );

      return {
        id: response.id,
        patientId: response.patientId,
        providerId: response.clinicianId,
        providerName: response.clinicianName,
        scheduledTime: response.startTime,
        endTime: response.endTime,
        status: this.mapAppointmentStatus(response.status),
        visitType: response.appointmentType,
        location: response.location || 'Online',
        notes: response.notes
      };
    } catch (error) {
      console.error('Failed to reschedule appointment with TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Get patient medical records
   */
  async getPatientRecords(patientId: string, type?: string): Promise<PatientRecord[]> {
    try {
      let endpoint = `/patients/${patientId}/notes`;
      if (type) {
        endpoint += `?type=${type}`;
      }

      const data = await this.request<any[]>(endpoint);
      
      // Map TherapyNotes data structure to our PatientRecord interface
      return data.map(item => ({
        id: item.id,
        patientId: patientId,
        providerId: item.authorId,
        date: item.createdDate,
        type: item.noteType,
        title: item.title,
        content: item.content
      }));
    } catch (error) {
      console.error('Failed to fetch patient records from TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Get medications for a patient
   */
  async getMedications(patientId: string): Promise<Medication[]> {
    try {
      const data = await this.request<any[]>(`/patients/${patientId}/medications`);
      
      // Map TherapyNotes data structure to our Medication interface
      return data.map(item => ({
        id: item.id,
        patientId: patientId,
        name: item.name,
        dosage: item.dosage,
        instructions: item.instructions,
        startDate: item.startDate,
        endDate: item.endDate,
        refills: item.refillsRemaining
      }));
    } catch (error) {
      console.error('Failed to fetch medications from TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Request medication refill
   */
  async requestRefill(medicationId: string): Promise<boolean> {
    try {
      await this.request<void>(
        `/medications/${medicationId}/refill-request`, 
        'POST'
      );
      return true;
    } catch (error) {
      console.error('Failed to request refill with TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Get available providers
   */
  async getProviders(): Promise<any[]> {
    try {
      return await this.request<any[]>('/providers');
    } catch (error) {
      console.error('Failed to fetch providers from TherapyNotes:', error);
      throw error;
    }
  }

  /**
   * Start telehealth session
   */
  async startTelehealthSession(appointmentId: string): Promise<{ url: string; token?: string }> {
    try {
      const response = await this.request<any>(
        `/telehealth/sessions/appointments/${appointmentId}`, 
        'POST'
      );
      
      return {
        url: response.joinUrl,
        token: response.token
      };
    } catch (error) {
      console.error('Failed to start telehealth session with TherapyNotes:', error);
      throw error;
    }
  }

  // Helper methods for data mapping

  /**
   * Map TherapyNotes appointment status to our standard status
   */
  private mapAppointmentStatus(status: string): 'scheduled' | 'confirmed' | 'canceled' | 'completed' {
    const statusMap: Record<string, 'scheduled' | 'confirmed' | 'canceled' | 'completed'> = {
      'Scheduled': 'scheduled',
      'Confirmed': 'confirmed',
      'Cancelled': 'canceled',
      'Completed': 'completed',
      'No Show': 'canceled'
    };

    return statusMap[status] || 'scheduled';
  }

  /**
   * Calculate appointment duration in minutes from start and end times
   */
  private calculateDuration(startTime?: string, endTime?: string): number {
    if (!startTime || !endTime) {
      return 60; // Default to 60 minutes
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    return Math.floor(durationMs / (1000 * 60));
  }
}