import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios, { AxiosError } from 'axios';

const router = express.Router();

// VSee API configuration
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://clinic.vsee.com/api/v2'; // Updated VSee Clinic API endpoint

if (!VSEE_API_KEY || !VSEE_API_SECRET) {
  console.error('VSee API credentials are missing or invalid');
}

// Configure axios instance with detailed logging
const vseeApi = axios.create({
  baseURL: VSEE_BASE_URL,
  timeout: 15000,
  headers: {
    'Authorization': `Bearer ${VSEE_API_KEY}`,
    'X-VSee-Secret': VSEE_API_SECRET,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced error handling with detailed logging
const handleVSeeError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error('VSee API Error Details:', {
      code: axiosError.code,
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      data: axiosError.response?.data
    });

    // Network connectivity issues
    if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      return new Error('Network connectivity issue. Please check your connection and try again.');
    }

    // Authentication issues
    if (axiosError.response?.status === 401) {
      return new Error('VSee API authentication failed. Please verify your credentials.');
    }

    // Not found errors
    if (axiosError.response?.status === 404) {
      return new Error('VSee API endpoint not found. Please verify the API configuration.');
    }

    return new Error(
      axiosError.response?.data?.message || 
      axiosError.response?.data?.error || 
      'Telehealth service error. Please try again.'
    );
  }
  return error;
};

// Validate VSee API connection
const validateVSeeConnection = async () => {
  try {
    console.log('Validating VSee API connection...');
    // Try to get clinic status as a basic health check
    const response = await vseeApi.get('/clinic/status');
    console.log('VSee API connection validated:', response.status === 200);
    return response.status === 200;
  } catch (error) {
    console.error('VSee API validation failed:', error);
    return false;
  }
};

// Create visit schema
const createVisitSchema = z.object({
  patientIds: z.array(z.string()),
  providerId: z.string(),
  scheduledTime: z.string().datetime(),
  duration: z.number().min(15).max(120),
  visitType: z.enum(['VIDEO', 'GROUP']),
  patientNames: z.array(z.string()),
  providerName: z.string(),
  reasonForVisit: z.string().optional(),
  maxParticipants: z.number().min(2).max(10).default(8),
  isGroupSession: z.boolean().default(false),
});

// Create a new visit
router.post('/visit', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  console.log('Attempting to create new telehealth visit...');

  try {
    const visitData = createVisitSchema.parse(req.body);
    console.log('Visit data validated:', visitData);

    // Test connection before proceeding
    const isConnected = await validateVSeeConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to telehealth service. Please verify API configuration.');
    }

    // Format participants data
    const participants = [
      ...visitData.patientIds.map((id, index) => ({
        user_id: id,
        name: visitData.patientNames[index],
        role: 'PATIENT'
      })),
      {
        user_id: visitData.providerId,
        name: visitData.providerName,
        role: 'PROVIDER'
      }
    ];

    // Create the visit
    const response = await vseeApi.post('/clinic/appointments', {
      participants,
      start_time: visitData.scheduledTime,
      duration: visitData.duration,
      type: visitData.visitType,
      reason: visitData.reasonForVisit || 'Scheduled Visit',
      settings: {
        max_participants: visitData.maxParticipants,
        group_session: visitData.isGroupSession,
        waiting_room: true,
        group_chat: true
      }
    });

    console.log('Visit created successfully:', response.data);

    res.json({
      success: true,
      visit: response.data
    });
  } catch (error: any) {
    const handledError = handleVSeeError(error);
    console.error('Failed to create visit:', handledError.message);

    res.status(400).json({
      success: false,
      error: handledError.message
    });
  }
});

export default router;