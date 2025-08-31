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

    getApplicationsByJob,
    deleteApplication,
    // New functions
     getCandidatesWithPayments,
    verifyPaymentTransaction,
    createEmployeeAccount,
    getEmailTrackingById
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

router.delete('/applications/:id', deleteApplication);

// Candidate Confirmation Management

router.get('/candidates-with-payments', getCandidatesWithPayments);

// 2. POST - Verify payment transaction
router.post('/applications/:id/verify-payment', verifyPaymentTransaction);

// 3. POST - Create employee account
router.post('/applications/:id/create-employee', createEmployeeAccount);

// 4. GET - Email tracking statistics
router.get('/email-tracking/:id', getEmailTrackingById);


export default router;

