// routes/hr.js
import express from 'express';
import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    sendHiringEmail,
    processPayment,
    createEmployee,
    getApplicationsByJob,
    getDashboardStats
} from '../Controllers/Hr/hrController.js';

import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
const router = express.Router();

// auth checker 
router.use(auth)

// Role checker 
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
router.put('/applications/:id/status', updateApplicationStatus);

// Hiring Process Routes
router.post('/applications/:id/hire', sendHiringEmail);
router.post('/applications/:id/reject', sendHiringEmail);
router.post('/applications/:id/payment', processPayment);
router.post('/applications/:id/create-employee', createEmployee);

// Dashboard and Statistics
router.get('/dashboard/stats', getDashboardStats);

export default router;