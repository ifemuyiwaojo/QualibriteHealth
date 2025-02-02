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

// Create a new telehealth visit
router.post('/visit', authenticateToken, authorizeRoles('provider', 'patient'), async (req: any, res) => {
  console.log('Attempting to create new telehealth visit...');

  try {
    const visitData = {
      patientIds: [req.user.id.toString()],
      patientNames: [req.user.email],
      providerId: req.body.providerId,
      providerName: req.body.providerName,
      scheduledTime: req.body.scheduledTime,
      duration: req.body.duration,
      isGroupSession: req.body.isGroupSession,
      visitType: req.body.isGroupSession ? 'GROUP' : 'VIDEO',
      reasonForVisit: req.body.reasonForVisit || 'Scheduled Visit',
      maxParticipants: req.body.isGroupSession ? 8 : 2
    };

    console.log('Visit data validated:', visitData);

    // Create intake using exact format from docs
    const intakeData = new FormData();
    intakeData.append('provider_id', visitData.providerId);
    intakeData.append('reason_for_visit', visitData.reasonForVisit);
    intakeData.append('type', '2'); // Schedule type as per docs
    intakeData.append('room_code', 'telehealth_room');
    intakeData.append('member_id', req.user.id.toString());

    console.log('Creating intake with data:', Object.fromEntries(intakeData));

    // Create intake using form data as shown in docs
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const intakeResponse = await vseeApi.post('/intakes', intakeData, config);

    if (!intakeResponse.data?.data?.id) {
      throw new Error('Failed to create intake: Invalid response format');
    }

    console.log('Intake created:', intakeResponse.data);

    // Create visit using the intake
    const visitPayload = new FormData();
    visitPayload.append('intake_id', intakeResponse.data.data.id);
    visitPayload.append('slot_start', Math.floor(new Date(visitData.scheduledTime).getTime() / 1000).toString());
    visitPayload.append('slot_end', Math.floor(new Date(visitData.scheduledTime).getTime() / 1000 + (visitData.duration * 60)).toString());
    visitPayload.append('type', '2'); // Schedule type
    visitPayload.append('room_code', 'telehealth_room');
    visitPayload.append('provider_id', visitData.providerId);

    console.log('Creating visit with data:', Object.fromEntries(visitPayload));

    const visitResponse = await vseeApi.post('/visits', visitPayload, config);
    console.log('Visit created successfully:', visitResponse.data);

    res.json({
      success: true,
      visit: visitResponse.data.data
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