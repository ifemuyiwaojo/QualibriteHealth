import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios from 'axios';

const router = express.Router();

// VSee API configuration
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://api.vsee.com/v1';

// Schema for creating a telehealth session
const createSessionSchema = z.object({
  patientId: z.string(),
  providerId: z.string(),
  scheduledTime: z.string().datetime(),
  duration: z.number().min(15).max(60),
});

// Create a new telehealth session
router.post('/session', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const session = createSessionSchema.parse(req.body);

    // Create VSee session using their API
    const vseeResponse = await axios.post(
      `${VSEE_BASE_URL}/sessions`,
      {
        patient_id: session.patientId,
        provider_id: session.providerId,
        scheduled_time: session.scheduledTime,
        duration_minutes: session.duration
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
      throw new Error('Failed to create VSee session');
    }

    res.json({
      success: true,
      session: vseeResponse.data
    });
  } catch (error: any) {
    console.error('Error creating telehealth session:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      error: 'Failed to create telehealth session',
      details: error.response?.data || error.message
    });
  }
});

// Get session details
router.get('/session/:sessionId', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const { sessionId } = req.params;

    const vseeResponse = await axios.get(
      `${VSEE_BASE_URL}/sessions/${sessionId}`,
      {
        headers: {
          'Authorization': `Bearer ${VSEE_API_KEY}`,
          'X-VSee-Secret': VSEE_API_SECRET
        }
      }
    );

    if (!vseeResponse.data) {
      throw new Error('Session not found');
    }

    res.json({
      success: true,
      session: vseeResponse.data
    });
  } catch (error: any) {
    console.error('Error fetching session:', error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      error: 'Failed to fetch session details',
      details: error.response?.data || error.message
    });
  }
});

// List upcoming sessions
router.get('/sessions/upcoming', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  try {
    const vseeResponse = await axios.get(
      `${VSEE_BASE_URL}/sessions`,
      {
        headers: {
          'Authorization': `Bearer ${VSEE_API_KEY}`,
          'X-VSee-Secret': VSEE_API_SECRET
        },
        params: {
          user_id: req.user.id,
          status: 'scheduled'
        }
      }
    );

    res.json({
      success: true,
      sessions: vseeResponse.data
    });
  } catch (error: any) {
    console.error('Error fetching upcoming sessions:', error.response?.data || error.message);
    res.status(error.response?.status || 400).json({
      success: false,
      error: 'Failed to fetch upcoming sessions',
      details: error.response?.data || error.message
    });
  }
});

export default router;