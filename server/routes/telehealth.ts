import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios, { AxiosError } from 'axios';
import { setTimeout } from 'timers/promises';

const router = express.Router();

// VSee API configuration with connection validation
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://clinic-api.vsee.com/api/v2';

if (!VSEE_API_KEY || !VSEE_API_SECRET) {
  console.error('VSee API credentials are missing or invalid');
}

// Axios instance with extended configuration and better error handling
const vseeApi = axios.create({
  baseURL: VSEE_BASE_URL,
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${VSEE_API_KEY}`,
    'X-VSee-Secret': VSEE_API_SECRET,
    'Content-Type': 'application/json'
  }
});

// Enhanced error handling for VSee API
const handleVSeeError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to telehealth service. Please try again later.');
    }

    if (axiosError.response?.status === 401) {
      console.error('VSee API authentication failed:', axiosError.response.data);
      throw new Error('Telehealth service authentication failed. Please verify API credentials.');
    }

    if (axiosError.response?.status === 403) {
      throw new Error('Access to telehealth service denied. Please verify API permissions.');
    }

    const errorMessage = axiosError.response?.data?.error || axiosError.message;
    console.error('VSee API error:', errorMessage);
    throw new Error(`Telehealth service error: ${errorMessage}`);
  }
  throw error;
};

// Validate VSee API connection
const validateVSeeConnection = async () => {
  try {
    await vseeApi.get('/health-check');
    return true;
  } catch (error) {
    console.error('VSee API connection validation failed:', error);
    return false;
  }
};

// Schema for creating a visit
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

// Create a new visit with enhanced error handling
router.post('/visit', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const visitData = createVisitSchema.parse(req.body);

    // Validate API connection before proceeding
    const isConnected = await validateVSeeConnection();
    if (!isConnected) {
      throw new Error('Telehealth service is currently unavailable. Please try again later.');
    }

    // Prepare participants data
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

    try {
      const vseeResponse = await vseeApi.post('/visits', {
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

      res.json({
        success: true,
        visit: vseeResponse.data
      });
    } catch (error) {
      handleVSeeError(error);
    }
  } catch (error: any) {
    console.error('Error creating telehealth visit:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create telehealth visit'
    });
  }
});

// Get upcoming visits with enhanced error handling
router.get('/visits/upcoming', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    // Validate API connection first
    const isConnected = await validateVSeeConnection();
    if (!isConnected) {
      throw new Error('Telehealth service is currently unavailable. Please try again later.');
    }

    const params: any = {
      status: 'SCHEDULED',
      sort: 'scheduled_at',
      order: 'asc'
    };

    if (req.user.role === 'patient') {
      params.patient_id = req.user.id;
    } else if (req.user.role === 'provider') {
      params.provider_id = req.user.id;
    }

    try {
      const vseeResponse = await vseeApi.get('/visits', { params });
      res.json({
        success: true,
        visits: vseeResponse.data.visits || []
      });
    } catch (error) {
      handleVSeeError(error);
    }
  } catch (error: any) {
    console.error('Error fetching upcoming visits:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to fetch upcoming visits'
    });
  }
});

export default router;