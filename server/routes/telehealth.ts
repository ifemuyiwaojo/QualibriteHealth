import express from 'express';
import { z } from 'zod';
import { db } from '@db';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import axios, { AxiosError } from 'axios';
import { generateTelehealthImage, TELEHEALTH_PROMPTS } from '../lib/image-generator';

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
      (axiosError.response?.data as any)?.message || 
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

// Image generation endpoints for the platform
router.post('/generate-hero-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const imagePath = await generateTelehealthImage({
      prompt: TELEHEALTH_PROMPTS.heroImage,
      filename: `hero-image-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Hero image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate hero image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-services-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image for a mental health services page showing a diverse, professional therapy consultation. Show a licensed therapist conducting an individual therapy session with a patient in a modern, luxurious mental health office. The scene should convey trust, professionalism, and quality care. Include modern office furnishings, natural lighting, comfortable seating, and subtle decorative elements that create a calming, therapeutic environment. The therapist should appear highly competent and empathetic. Studio-quality photography with professional lighting, shot with 85mm lens, shallow depth of field, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `services-consultation-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Services consultation image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate services image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-faq-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image for an FAQ page of a premium mental health platform. Show a friendly, professional mental health support specialist sitting at a modern desk, ready to assist with questions. The person should have a warm, approachable expression while maintaining professional credibility. Include modern office technology, multiple communication devices (phone, computer, tablet), organized documentation, and a clean, contemporary workspace that conveys expertise and accessibility. Natural lighting with professional photography quality, shot with 85mm lens, perfect focus, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `faq-support-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'FAQ support image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate FAQ image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-contact-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image for a contact page showing a professional mental health customer service team. Show diverse, friendly professionals in a modern call center or support office environment, wearing headsets and working at contemporary workstations. The scene should convey 24/7 availability, professional support, and immediate assistance. Include multiple workstations, modern technology, comfortable office lighting, and team members actively engaged in helping patients. Professional office photography with excellent lighting, shot with wide-angle lens, deep focus, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `contact-support-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Contact support image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate contact image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-live-chat-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing a friendly mental health support specialist engaged in live chat support. Show a professional, diverse person sitting at a modern desk with multiple monitors displaying chat interfaces, smiling warmly while typing responses. The setting should be a contemporary customer service environment with modern technology, comfortable lighting, and a welcoming atmosphere. Include details like headset, ergonomic chair, plants, and professional office decor that conveys immediate, caring support. High-quality portrait photography, 85mm lens, perfect lighting, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `live-chat-support-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Live chat support image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate live chat image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-call-team-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing a professional mental health phone support team. Show diverse, caring professionals in a modern call center environment, each wearing professional headsets and actively engaged in phone conversations with patients. The scene should convey warmth, professionalism, and immediate availability. Include modern office workstations, multiple phone lines, comfortable seating, and professional lighting. The team members should appear empathetic and highly trained. Professional office photography with excellent lighting, shot at medium angle, deep focus, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `call-team-support-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Call team support image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate call team image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-home-therapy-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image for a home page showing an elegant telehealth therapy session in progress. Show a professional, diverse therapist conducting a video call with a patient from a beautifully designed, modern home office. The therapist should appear highly competent and caring, sitting at a contemporary desk with a large monitor showing the video call interface. Include warm, natural lighting, modern furniture, plants, books, and professional decor that creates a welcoming, therapeutic atmosphere. High-quality lifestyle photography, 50mm lens, perfect composition, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `home-therapy-session-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Home therapy session image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate home therapy image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-platform-features-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing the advanced features of a telehealth platform. Show a sleek, modern computer setup with multiple screens displaying a sophisticated telehealth interface, video calls, patient records, and scheduling systems. The scene should be in a high-tech medical office environment with professional lighting and contemporary design. Include details like medical certificates on walls, modern office furniture, and technology that conveys cutting-edge healthcare innovation. High-quality technology photography, wide-angle lens, excellent lighting, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `platform-features-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Platform features image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate platform features image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-individual-therapy-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing an individual therapy session via telehealth. Show a professional, diverse therapist in a warm, modern office setting conducting a video therapy session on a large monitor. The therapist should appear highly competent, empathetic, and engaged. Include comfortable seating, plants, books, soft lighting, and professional decor that creates a calming, therapeutic atmosphere. The scene should convey trust, professionalism, and effective one-on-one mental health care. High-quality portrait photography, 85mm lens, perfect lighting, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `individual-therapy-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Individual therapy image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate individual therapy image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-group-therapy-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing a group therapy session conducted via telehealth. Show a professional therapist facilitating a video group session with multiple participants visible on a large screen. The setting should be a modern, comfortable office with warm lighting. The therapist should appear skilled and caring, managing the group discussion professionally. Include modern technology, comfortable seating, and a supportive environment that encourages open communication. High-quality technology photography, wide-angle lens, excellent lighting, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `group-therapy-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Group therapy image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate group therapy image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-medication-management-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing a medication management consultation. Show a professional psychiatrist in a modern medical office conducting a telehealth medication review session. The psychiatrist should appear highly competent and trustworthy, sitting at a desk with medical references, prescription materials, and a computer displaying patient information. Include medical diplomas on the wall, modern office furniture, and professional lighting that conveys expert psychiatric care. High-quality medical photography, 85mm lens, perfect focus, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `medication-management-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Medication management image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate medication management image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-crisis-intervention-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing crisis intervention support. Show a professional mental health crisis counselor in a modern support center, available 24/7 for emergency mental health situations. The counselor should appear calm, compassionate, and highly trained, sitting at a workstation with multiple communication devices (phone, computer, headset). Include emergency protocol materials, calming office environment, and technology that conveys immediate, professional crisis support. High-quality emergency services photography, excellent lighting, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `crisis-intervention-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Crisis intervention image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate crisis intervention image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/generate-team-photo-image', async (req, res) => {
  try {
    const timestamp = Date.now();
    const prompt = `Create a BOLD, photorealistic image showing a diverse team of mental health professionals. Show a group of 5-6 licensed psychiatrists, therapists, and mental health specialists in a modern medical office setting. The team should appear highly professional, diverse in ethnicity and gender, wearing appropriate medical/professional attire. Include a contemporary office environment with natural lighting, modern furniture, and medical credentials/diplomas visible. The team should convey expertise, compassion, and trustworthiness. High-quality team photography, wide-angle lens, perfect lighting, ultra-high resolution.`;
    
    const imagePath = await generateTelehealthImage({
      prompt,
      filename: `team-photo-${timestamp}.png`,
      directory: 'attached_assets/generated_images'
    });
    
    res.json({
      success: true,
      imagePath,
      message: 'Team photo image generated successfully'
    });
  } catch (error: any) {
    console.error('Failed to generate team photo image:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;