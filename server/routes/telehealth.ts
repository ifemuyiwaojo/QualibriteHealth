import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios, { AxiosError } from 'axios';
import { setTimeout } from 'timers/promises';

const router = express.Router();

// VSee API configuration
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://api.vsee.com/clinic/v2'; // Updated API endpoint

if (!VSEE_API_KEY || !VSEE_API_SECRET) {
  console.error('VSee API credentials are missing');
}

// Configure axios instance
const vseeApi = axios.create({
  baseURL: VSEE_BASE_URL,
  timeout: 10000, // Reduced timeout for faster error detection
  headers: {
    'Authorization': `Bearer ${VSEE_API_KEY}`,
    'X-VSee-Secret': VSEE_API_SECRET,
    'Content-Type': 'application/json'
  }
});

// Enhanced error handling
const handleVSeeError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error('VSee API Error Details:', {
      code: axiosError.code,
      message: axiosError.message,
      response: axiosError.response?.data
    });

    if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      return new Error('Network connectivity issue. Please check your connection and try again.');
    }

    if (axiosError.response?.status === 401) {
      return new Error('Authentication failed. Please verify your API credentials.');
    }

    return new Error(axiosError.response?.data?.message || 'Telehealth service error. Please try again.');
  }
  return error;
};

// Validate VSee connection
const validateVSeeConnection = async () => {
  try {
    console.log('Attempting to validate VSee API connection...');
    const response = await vseeApi.get('/ping');
    console.log('VSee API connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('VSee API connection failed:', error);
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
  console.log('Creating new telehealth visit...');

  try {
    const visitData = createVisitSchema.parse(req.body);
    console.log('Visit data validated:', visitData);

    // Test connection before proceeding
    const isConnected = await validateVSeeConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to telehealth service. Please try again later.');
    }

    const participants = visitData.patientIds.map((id, index) => ({
      id,
      name: visitData.patientNames[index],
      role: 'PATIENT'
    }));

    participants.push({
      id: visitData.providerId,
      name: visitData.providerName,
      role: 'PROVIDER'
    });

    const response = await vseeApi.post('/visits', {
      participants,
      scheduled_at: visitData.scheduledTime,
      duration_minutes: visitData.duration,
      visit_type: visitData.visitType,
      reason_for_visit: visitData.reasonForVisit || 'Scheduled Visit',
      status: 'SCHEDULED',
      settings: {
        max_participants: visitData.maxParticipants,
        is_group_session: visitData.isGroupSession,
        enable_waiting_room: true,
        allow_group_chat: true
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

// Get upcoming visits
router.get('/visits/upcoming', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    console.log('Fetching upcoming visits...');

    const isConnected = await validateVSeeConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to telehealth service. Please try again later.');
    }

    const params = {
      status: 'SCHEDULED',
      sort: 'scheduled_at',
      order: 'asc'
    };

    if (req.user.role === 'patient') {
      params.patient_id = req.user.id;
    } else if (req.user.role === 'provider') {
      params.provider_id = req.user.id;
    }

    const response = await vseeApi.get('/visits', { params });
    console.log('Visits fetched successfully');

    res.json({
      success: true,
      visits: response.data.visits || []
    });
  } catch (error: any) {
    const handledError = handleVSeeError(error);
    console.error('Failed to fetch visits:', handledError.message);

    res.status(400).json({
      success: false,
      error: handledError.message
    });
  }
});

export default router;