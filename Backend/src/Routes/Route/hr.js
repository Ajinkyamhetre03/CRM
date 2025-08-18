// routes/hr.js - Updated HR Routes
import express from 'express';
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus, // Enhanced with email triggers
    sendHiringEmail,
    processPayment,
    createEmployee,
    getApplicationsByJob,
    getDashboardStats,
    // New functions
    getCandidateConfirmations,
    verifyPayment,
    getEmailTrackingStats
} from '../Controllers/Hr/hrController.js';

import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
const router = express.Router();

// Auth and role checkers
router.use(auth)
router.use(checkRoleAndDepartment(["manager", "employee", "intern"], ["HR"]));

// Job Management Routes
router.post('/jobs', createJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/jobs/:jobId/applications', getApplicationsByJob);

// Application Management Routes
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);

// Enhanced status update - automatically triggers hire/reject emails
router.put('/applications/:id/status', updateApplicationStatus);

// Candidate Confirmation Management
router.get('/candidate-confirmations', getCandidateConfirmations);

// Payment Verification
router.post('/applications/:id/verify-payment', verifyPayment);

// Final Employee Creation
router.post('/applications/:id/create-employee', createEmployee);

// Email and Statistics
router.get('/email-stats', getEmailTrackingStats);
router.get('/dashboard/stats', getDashboardStats);

export default router;

