import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios, { AxiosError } from 'axios';

const router = express.Router();

// VSee API configuration
const VSEE_API_KEY = process.env.VSEE_API_KEY;
const VSEE_API_SECRET = process.env.VSEE_API_SECRET;
const VSEE_BASE_URL = 'https://api.vseepreview.com/vc/next/api_v3';

if (!VSEE_API_KEY || !VSEE_API_SECRET) {
  console.error('VSee API credentials are missing or invalid');
  process.exit(1);
}

// Configure axios instance with detailed logging
const vseeApi = axios.create({
  baseURL: VSEE_BASE_URL,
  timeout: 15000,
  headers: {
    'X-ApiToken': VSEE_API_KEY,
    'X-ApiSecret': VSEE_API_SECRET,
    'X-AccountCode': 'vclinic'
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

    if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      return new Error('Network connectivity issue. Please check your connection and try again.');
    }

    if (axiosError.response?.status === 401) {
      return new Error('VSee API authentication failed. Please verify your credentials.');
    }

    if (axiosError.response?.status === 404) {
      return new Error('VSee API endpoint not found. Please verify the API configuration.');
    }

    return new Error(
      axiosError.response?.data?.message || 
      'Telehealth service error. Please try again.'
    );
  }
  return error;
};

// Join session endpoint
router.post('/visit/:sessionId/join', authenticateToken, async (req: any, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    console.log('User attempting to join session:', { sessionId, userId, userRole });

    // Create a token for the user
    const tokenResponse = await vseeApi.post('/tokens', {
      session_id: sessionId,
      user_id: userId.toString(),
      user_name: userRole === 'provider' ? 'Provider' : 'Patient',
      role: userRole.toUpperCase()
    });

    if (!tokenResponse.data?.token) {
      throw new Error('Failed to create VSee token');
    }

    // Get room URL
    const roomUrl = `${VSEE_BASE_URL}/rooms/${sessionId}`;

    console.log('Successfully created join session data:', { sessionId, roomUrl });

    res.json({
      success: true,
      token: tokenResponse.data.token,
      roomUrl,
    });
  } catch (error) {
    const handledError = handleVSeeError(error);
    console.error('Error joining session:', handledError);
    res.status(500).json({
      success: false,
      error: handledError.message
    });
  }
});

// Session creation endpoint
router.post('/session', authenticateToken, async (req, res) => {
  try {
    const { userId, role } = req.body;
    console.log('Creating new session for user:', userId, 'with role:', role);

    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create room token
    const tokenResponse = await vseeApi.post('/tokens', {
      session_id: sessionId,
      user_id: userId.toString(),
      user_name: role === 'provider' ? 'Provider' : 'Patient',
      role: role.toUpperCase()
    });

    if (!tokenResponse.data?.token) {
      throw new Error('Failed to create VSee token');
    }

    // Create a VSee room
    const roomResponse = await vseeApi.post('/rooms', {
      room_id: sessionId,
      api_key: VSEE_API_KEY,
      max_participants: 2,
      room_type: 'meeting'
    });

    if (!roomResponse.data?.success) {
      throw new Error('Failed to create VSee room');
    }

    console.log('Session created successfully:', sessionId);

    res.json({
      success: true,
      sessionId,
      roomData: roomResponse.data,
      token: tokenResponse.data.token
    });
  } catch (error) {
    const handledError = handleVSeeError(error);
    console.error('Error creating session:', handledError);
    res.status(500).json({
      success: false,
      error: handledError.message
    });
  }
});

// Active session retrieval endpoint
router.get('/active-session', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.id;

    // For now, we'll return no active session
    // In a full implementation, this would check the database for active sessions
    res.json({
      success: true,
      session: null
    });
  } catch (error) {
    console.error('Error fetching active session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active session'
    });
  }
});

export default router;