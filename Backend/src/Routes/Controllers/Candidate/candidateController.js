// controllers/candidate.js
import Job from '../../../Models/Job.js';
import Application from '../../../Models/Application.js';
import User from '../../../Models/User.js';

// Get all active jobs for candidates to view
export const getActiveJobs = async (req, res) => {
    try {
        const jobs = await Job.find({})
        res.status(200).json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

// Get detailed job information
export const getJobDetails = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('createdBy', 'username');

        if (!job || job.status !== 'active') {
            return res.status(404).json({
                success: false,
                message: 'Job not found or no longer active'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job details',
            error: error.message
        });
    }
};

// Submit job application
export const submitApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const {
            // Personal Information
            fullName,
            email,
            phone,
            address,
            dateOfBirth,
            // Professional Information
            experience,
            currentSalary,
            expectedSalary,
            noticePeriod,
            // Education
            education,
            // Skills and Experience
            skills,
            previousExperience,
            // Additional Information
            resumeUrl,
            coverLetter,
            portfolioUrl,
            linkedinProfile,
            whyInterested
        } = req.body;

        // Check if job exists and is active
        const job = await Job.findById(jobId);
        if (!job || job.status !== 'active') {
            return res.status(404).json({
                success: false,
                message: 'Job not found or no longer active'
            });
        }

        // Check if application deadline has passed
        if (new Date() > job.applicationDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Application deadline has passed'
            });
        }

        // Check if maximum applications reached
        if (job.currentApplications >= job.maxApplications) {
            return res.status(400).json({
                success: false,
                message: 'Maximum number of applications reached for this job'
            });
        }

        // Check if user has already applied for this job
        const existingApplication = await Application.findOne({
            jobId,
            email: email.toLowerCase()
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Validate required resume URL
        if (!resumeUrl) {
            return res.status(400).json({
                success: false,
                message: 'Resume URL is required (Google Drive, LinkedIn, etc.)'
            });
        }

        // Validate resume URL format
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(resumeUrl)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid resume URL'
            });
        }

        // Parse JSON strings if they are strings
        const parsedEducation = typeof education === 'string' ? JSON.parse(education) : education;
        const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        const parsedPreviousExperience = typeof previousExperience === 'string' ? JSON.parse(previousExperience) : previousExperience;
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        // Create new application
        const application = new Application({
            jobId,
            fullName,
            email: email.toLowerCase(),
            phone,
            address: parsedAddress,
            dateOfBirth: new Date(dateOfBirth),
            experience,
            currentSalary: currentSalary ? parseInt(currentSalary) : undefined,
            expectedSalary: parseInt(expectedSalary),
            noticePeriod,
            education: parsedEducation,
            skills: parsedSkills,
            previousExperience: parsedPreviousExperience,
            resumeUrl,
            coverLetter,
            portfolioUrl,
            linkedinProfile,
            whyInterested
        });

        await application.save();

        // Update job application count
        job.currentApplications += 1;
        await job.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: application._id,
                jobTitle: job.jobTitle
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

// Get application status
export const getApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { email } = req.query;

        const application = await Application.findById(applicationId)
            .populate('jobId', 'jobTitle department')
            .select('status createdAt reviewDate hrComments isHired paymentCompleted employeeCreated');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify email for security
        if (application.email !== email.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application status',
            error: error.message
        });
    }
};

// Complete payment for hired candidates
export const completePayment = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { transactionId, paymentMethod, amount } = req.body;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (!application.isHired) {
            return res.status(400).json({
                success: false,
                message: 'Application is not in hired status'
            });
        }

        if (application.paymentCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed'
            });
        }

        // Validate payment amount
        if (amount !== 1000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment amount. Required: ₹1000'
            });
        }

        // In a real application, you would integrate with a payment gateway here
        // For now, we'll just simulate payment processing

        // Generate a simple transaction ID if not provided
        const finalTransactionId = transactionId || `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

        // Update application with payment details
        application.paymentCompleted = true;
        application.paymentTransactionId = finalTransactionId;
        application.paymentDate = new Date();

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Payment completed successfully',
            data: {
                transactionId: finalTransactionId,
                amount: 1000,
                paymentDate: application.paymentDate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// Setup employee account after payment completion
export const setupEmployeeAccount = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { email, password } = req.body;

        const application = await Application.findById(applicationId)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (!application.paymentCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Payment not completed yet'
            });
        }

        if (application.employeeCreated) {
            return res.status(400).json({
                success: false,
                message: 'Employee account already created'
            });
        }

        // Validate email matches application
        if (application.email !== email.toLowerCase()) {
            return res.status(400).json({
                success: false,
                message: 'Email does not match application'
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        // Generate employee code
        const employeeCount = await User.countDocuments();
        const employeeCode = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

        // Generate username from full name
        const username = application.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '.')
            .replace(/\.+/g, '.')
            .replace(/^\.|\.$/g, '');

        // Check if username already exists, if so append number
        let finalUsername = username;
        let counter = 1;
        while (await User.findOne({ username: finalUsername })) {
            finalUsername = `${username}${counter}`;
            counter++;
        }

        // Create new employee user
        const newEmployee = new User({
            employeeCode,
            username: finalUsername,
            password, // Will be hashed by pre-save middleware
            role: 'employee',
            department: application.jobId.department,
            email: application.email,
            contact: application.phone,
            Salary: application.expectedSalary,
            createdBy: 'HR_SYSTEM'
        });

        await newEmployee.save();

        // Update application
        application.employeeCreated = true;
        application.employeeId = newEmployee._id;
        await application.save();

        res.status(201).json({
            success: true,
            message: 'Employee account created successfully',
            data: {
                employeeCode,
                username: finalUsername,
                email: application.email,
                department: application.jobId.department
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating employee account',
            error: error.message
        });
    }
};