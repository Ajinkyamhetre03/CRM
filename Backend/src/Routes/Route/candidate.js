// routes/candidate.js - Updated Candidate Routes  
import express from 'express';
import {
    getActiveJobs,
    getJobDetails,
    submitApplication,
    completePayment,
    setupEmployeeAccount,
    // New functions
    confirmHiring,
    submitPaymentDetails,
    getApplicationDetails,
    myApplication
} from '../Controllers/Candidate/candidateController.js';

const router = express.Router();

// Public routes for job viewing
router.get('/jobs', getActiveJobs);
router.get('/jobs/:id', getJobDetails);

// Application routes
router.post('/jobs/:jobId/apply', submitApplication);

// Application status check (requires email verification)

router.post('/applications/myapplication', myApplication);

// New: Candidate confirmation route (accessed via email link)
 router.post('/applications/:applicationId/confirm-hiring/:token', confirmHiring);



router.get('/applications/:applicationId/confirm-hiring/:token', (req, res) => {
    const { applicationId , token} = req.params;
    res.send({ applicationId, token });
});

// Enhanced payment routes
router.get('/applications/:applicationId/payment-details/:token', getApplicationDetails);
router.post('/applications/:applicationId/payment/:token', submitPaymentDetails);

// Legacy routes (keep for backward compatibility)
router.post('/applications/:applicationId/payment', completePayment);
router.post('/applications/:applicationId/setup-account', setupEmployeeAccount);

export default router;