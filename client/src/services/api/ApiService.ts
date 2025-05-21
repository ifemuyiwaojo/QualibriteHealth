import { ApiAdapter, Appointment, PatientRecord, Medication } from '../adapters/ApiAdapter';
import { TherapyNotesAdapter } from '../adapters/TherapyNotesAdapter';
import { MockAdapter } from '../adapters/MockAdapter';

/**
 * API Provider Types
 * Add new provider types here as they're implemented
 */
export type ApiProviderType = 'therapynotes' | 'vsee' | 'mock';

/**
 * API Service Configuration
 */
export interface ApiServiceConfig {
  provider: ApiProviderType;
  apiKey?: string;
  baseUrl?: string;
  additionalConfig?: Record<string, any>;
}

/**
 * API Service Class
 * 
 * This service acts as a facade for different API adapters.
 * It allows the application to easily switch between different providers
 * without changing the core application logic.
 */
export class ApiService {
  private static instance: ApiService;
  private adapter: ApiAdapter | null = null;
  private providerType: ApiProviderType = 'mock';
  
  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of ApiService
   */
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Initialize the API service with the selected provider
   */
  public async initialize(config: ApiServiceConfig): Promise<void> {
    this.providerType = config.provider;
    
    // Create the appropriate adapter based on provider type
    switch (config.provider) {
      case 'therapynotes':
        this.adapter = new TherapyNotesAdapter();
        break;
      
      case 'mock':
        this.adapter = new MockAdapter();
        break;
        
      // Add other provider adapters here as they're implemented
      
      default:
        console.warn(`Provider ${config.provider} not recognized, using mock adapter`);
        this.adapter = new MockAdapter();
    }
    
    // Initialize the adapter with configuration
    await this.adapter.initialize({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      ...config.additionalConfig
    });
    
    console.log(`API Service initialized with ${config.provider} provider`);
  }

  /**
   * Check if the service is properly initialized and authenticated
   */
  public isInitialized(): boolean {
    return !!this.adapter && this.adapter.isAuthenticated();
  }

  /**
   * Get the current provider type
   */
  public getProviderType(): ApiProviderType {
    return this.providerType;
  }

  /**
   * Ensure the adapter is available, throw an error if not
   */
  private ensureAdapter(): ApiAdapter {
    if (!this.adapter) {
      throw new Error('API Service not initialized. Call initialize() first.');
    }
    return this.adapter;
  }

  // API Methods - These delegate to the appropriate adapter

  /**
   * Get appointments for a specific patient
   */
  public async getAppointments(patientId: string): Promise<Appointment[]> {
    return this.ensureAdapter().getAppointments(patientId);
  }

  /**
   * Schedule a new appointment
   */
  public async scheduleAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    return this.ensureAdapter().scheduleAppointment(appointmentData);
  }

  /**
   * Cancel an existing appointment
   */
  public async cancelAppointment(appointmentId: string): Promise<boolean> {
    return this.ensureAdapter().cancelAppointment(appointmentId);
  }

  /**
   * Reschedule an existing appointment
   */
  public async rescheduleAppointment(appointmentId: string, newTime: string): Promise<Appointment> {
    return this.ensureAdapter().rescheduleAppointment(appointmentId, newTime);
  }

  /**
   * Get patient medical records
   */
  public async getPatientRecords(patientId: string, type?: string): Promise<PatientRecord[]> {
    return this.ensureAdapter().getPatientRecords(patientId, type);
  }

  /**
   * Get medications for a patient
   */
  public async getMedications(patientId: string): Promise<Medication[]> {
    return this.ensureAdapter().getMedications(patientId);
  }

  /**
   * Request medication refill
   */
  public async requestRefill(medicationId: string): Promise<boolean> {
    return this.ensureAdapter().requestRefill(medicationId);
  }

  /**
   * Get available providers
   */
  public async getProviders(): Promise<any[]> {
    return this.ensureAdapter().getProviders();
  }

  /**
   * Start telehealth session
   */
  public async startTelehealthSession(appointmentId: string): Promise<{ url: string; token?: string }> {
    return this.ensureAdapter().startTelehealthSession(appointmentId);
  }
}