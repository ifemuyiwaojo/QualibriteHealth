import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios from 'axios';

const router = express.Router();

// VSee API configuration
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://clinic-api.vsee.com/api/v2';

// Schema for creating a visit
const createVisitSchema = z.object({
  patientId: z.string(),
  providerId: z.string(),
  scheduledTime: z.string().datetime(),
  duration: z.number().min(15).max(60),
  visitType: z.string().default('SCHEDULED'),
});

// Create a new visit
router.post('/visit', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const visitData = createVisitSchema.parse(req.body);

    // Create VSee visit using their Visit API
    const vseeResponse = await axios.post(
      `${VSEE_BASE_URL}/visits`,
      {
        patient_id: visitData.patientId,
        provider_id: visitData.providerId,
        scheduled_time: visitData.scheduledTime,
        duration_minutes: visitData.duration,
        visit_type: visitData.visitType
      },
      {
        headers: {
          'Authorization': `Bearer ${VSEE_API_KEY}`,
          'X-VSee-Secret': VSEE_API_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!vseeResponse.data) {
      throw new Error('Failed to create VSee visit');
    }

    res.json({
      success: true,
      visit: vseeResponse.data
    });
  } catch (error: any) {
    console.error('Error creating telehealth visit:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      error: 'Failed to create telehealth visit',
      details: error.response?.data || error.message
    });
  }
});

// Get visit details
router.get('/visit/:visitId', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const { visitId } = req.params;

    const vseeResponse = await axios.get(
      `${VSEE_BASE_URL}/visits/${visitId}`,
      {
        headers: {
          'Authorization': `Bearer ${VSEE_API_KEY}`,
          'X-VSee-Secret': VSEE_API_SECRET
        }
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

// List upcoming visits
router.get('/visits/upcoming', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const vseeResponse = await axios.get(
      `${VSEE_BASE_URL}/visits`,
      {
        headers: {
          'Authorization': `Bearer ${VSEE_API_KEY}`,
          'X-VSee-Secret': VSEE_API_SECRET
        },
        params: {
          user_id: req.user.id,
          status: 'SCHEDULED',
          sort: 'scheduled_time',
          order: 'asc'
        }
      }
    );

    res.json({
      success: true,
      visits: vseeResponse.data
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
    const vseeResponse = await axios.post(
      `${VSEE_BASE_URL}/visits/${visitId}/${isProvider ? 'start' : 'join'}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${VSEE_API_KEY}`,
          'X-VSee-Secret': VSEE_API_SECRET
        }
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

export default router;