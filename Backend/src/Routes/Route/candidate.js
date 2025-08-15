// routes/candidate.js
import express from 'express';
import {
    getActiveJobs,
    getJobDetails,
    submitApplication,
    getApplicationStatus,
    completePayment,
    setupEmployeeAccount
} from '../Controllers/Candidate/candidateController.js';

const router = express.Router();

// Public routes for job viewing
router.get('/jobs', getActiveJobs);
router.get('/jobs/:id', getJobDetails);

// Application routes
router.post('/jobs/:jobId/apply', submitApplication);

// Application status check (requires email verification)
router.get('/applications/:applicationId/status', getApplicationStatus);

// Payment completion route (accessed via email link)
router.post('/applications/:applicationId/payment', completePayment);

// Employee account setup (after payment)
router.post('/applications/:applicationId/setup-account', setupEmployeeAccount);

export default router;