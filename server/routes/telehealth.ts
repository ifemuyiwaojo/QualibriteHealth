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
const VSEE_BASE_URL = 'https://clinic-api.vsee.com/api/v2';

if (!VSEE_API_KEY || !VSEE_API_SECRET) {
  console.error('VSee API credentials are not properly configured');
}

// Axios instance with extended configuration
const vseeApi = axios.create({
  baseURL: VSEE_BASE_URL,
  timeout: 30000, // Increased timeout
  headers: {
    'Authorization': `Bearer ${VSEE_API_KEY}`,
    'X-VSee-Secret': VSEE_API_SECRET,
    'Content-Type': 'application/json'
  }
});

// Helper function to handle API errors
const handleVSeeError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ENOTFOUND') {
      throw new Error('Unable to connect to telehealth service. Please try again later.');
    }
    if (error.response?.status === 401) {
      throw new Error('Telehealth service authentication failed. Please contact support.');
    }
    throw new Error(error.response?.data?.error || 'Telehealth service error. Please try again.');
  }
  throw error;
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

// Create a new visit (single or group)
router.post('/visit', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const visitData = createVisitSchema.parse(req.body);

    // Prepare participants data
    const participants = visitData.patientIds.map((id, index) => ({
      id,
      name: visitData.patientNames[index],
      role: 'PATIENT'
    }));

    // Add provider to participants
    participants.push({
      id: visitData.providerId,
      name: visitData.providerName,
      role: 'PROVIDER'
    });

    try {
      // Validate API connection before proceeding
      await vseeApi.get('/health-check').catch(() => {
        throw new Error('Telehealth service is currently unavailable. Please try again later.');
      });

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

// Get upcoming visits with basic error handling
router.get('/visits/upcoming', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
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