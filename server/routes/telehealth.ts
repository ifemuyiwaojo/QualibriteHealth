import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios from 'axios';
import { setTimeout } from 'timers/promises';

const router = express.Router();

// VSee API configuration
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://clinic-api.vsee.com/api/v2';

// Axios instance with retry logic
const vseeApi = axios.create({
  baseURL: VSEE_BASE_URL,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${VSEE_API_KEY}`,
    'X-VSee-Secret': VSEE_API_SECRET,
    'Content-Type': 'application/json'
  }
});

// Add retry logic
vseeApi.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }
  config.retry -= 1;
  const delayMs = config.retryDelay || 1000;
  await setTimeout(delayMs);
  return vseeApi(config);
});

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

    // Create VSee visit with retry logic
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
      }, {
        retry: 3,
        retryDelay: 1000
      });

      res.json({
        success: true,
        visit: vseeResponse.data
      });
    } catch (error: any) {
      console.error('VSee API Error:', error.response?.data || error.message);
      throw new Error('Failed to communicate with telehealth service');
    }
  } catch (error: any) {
    console.error('Error creating telehealth visit:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create telehealth visit'
    });
  }
});

// Get visit details
router.get('/visit/:visitId', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const { visitId } = req.params;

    const vseeResponse = await vseeApi.get(
      `/visits/${visitId}`,
      {
        retry: 3,
        retryDelay: 1000
      }
    );

    if (!vseeResponse.data) {
      throw new Error('Visit not found');
    }

    res.json({
      success: true,
      visit: vseeResponse.data
    });
  } catch (error: any) {
    console.error('Error fetching visit:', error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      error: 'Failed to fetch visit details',
      details: error.response?.data || error.message
    });
  }
});

// List upcoming visits with retry logic
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

    const vseeResponse = await vseeApi.get('/visits', {
      params,
      retry: 3,
      retryDelay: 1000
    });

    res.json({
      success: true,
      visits: vseeResponse.data.visits || []
    });
  } catch (error: any) {
    console.error('Error fetching upcoming visits:', error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      error: 'Failed to fetch upcoming visits',
      details: error.response?.data || error.message
    });
  }
});

// Start or join a visit
router.post('/visit/:visitId/join', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const { visitId } = req.params;
    const isProvider = req.user.role === 'provider';

    // Get room URL from VSee
    const vseeResponse = await vseeApi.post(
      `/visits/${visitId}/${isProvider ? 'start' : 'join'}`,
      {
        user_id: req.user.id,
        user_type: req.user.role.toUpperCase()
      },
      {
         retry: 3,
         retryDelay: 1000
      }
    );

    if (!vseeResponse.data || !vseeResponse.data.room_url) {
      throw new Error('Failed to get room URL');
    }

    res.json({
      success: true,
      roomUrl: vseeResponse.data.room_url
    });
  } catch (error: any) {
    console.error('Error joining visit:', error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      error: 'Failed to join visit',
      details: error.response?.data || error.message
    });
  }
});

// Add participant to group session
router.post('/visit/:visitId/participants', authenticateToken, authorizeRoles('provider'), async (req: any, res) => {
  try {
    const { visitId } = req.params;
    const { participantId, participantName, role = 'PATIENT' } = req.body;

    const vseeResponse = await vseeApi.post(
      `/visits/${visitId}/participants`,
      {
        participant: {
          id: participantId,
          name: participantName,
          role
        }
      },
      {
        retry: 3,
        retryDelay: 1000
      }
    );

    res.json({
      success: true,
      participant: vseeResponse.data
    });
  } catch (error: any) {
    console.error('Error adding participant:', error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      error: 'Failed to add participant',
      details: error.response?.data || error.message
    });
  }
});

export default router;