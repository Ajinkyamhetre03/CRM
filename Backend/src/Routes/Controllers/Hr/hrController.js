// controllers/hr.js
import Job from '../../../Models/Job.js';
import Application from '../../../Models/Application.js';
import User from '../../../Models/User.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configure nodemailer (use your email service)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Job Management
export const createJob = async (req, res) => {
    try {
        const {
            jobTitle,
            jobLocation,
            experience,
            shift,
            department,
            jobDescription,
            keyResponsibilities,
            requiredSkills,
            applicationDeadline,
            maxApplications,
            createdBy
        } = req.body;

        const job = new Job({
            jobTitle,
            jobLocation,
            experience,
            shift,
            department,
            jobDescription,
            keyResponsibilities,
            requiredSkills,
            applicationDeadline,
            maxApplications,
            createdBy: req.user.id
        });

        await job.save();
        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {

        const jobs = await Job.find({})
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 })


        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};

// Application Management
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId')
            .populate('reviewedBy', 'username email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
};

export const getApplicationsByJob = async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('reviewedBy', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            {
                status,
                hrComments: comments,
                //reviewedBy: req.user.id,
                reviewedBy: "689cd4aa2f51dc0cd7cae7e7",
                reviewDate: new Date()
            },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

export const sendHiringEmail = async (req, res) => {
    try {
        const { decision } = req.body; // 'hired' or 'rejected'
        const application = await Application.findById(req.params.id)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        let emailSubject, emailContent;

        if (decision === 'hired') {
            emailSubject = `Congratulations! You're Hired - ${application.jobId.jobTitle}`;
            emailContent = `
                <h2>Congratulations ${application.fullName}!</h2>
                <p>We are pleased to inform you that you have been selected for the position of <strong>${application.jobId.jobTitle}</strong>.</p>
                <p>To proceed with your onboarding, please complete the data privacy payment of ₹1000 by clicking the link below:</p>
                <a href="${process.env.FRONTEND_URL}/payment/${application._id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Payment</a>
                <p>This payment ensures the security and privacy of your personal data in our systems.</p>
                <p>Welcome to our team!</p>
            `;

            // Update application status
            application.status = 'hired';
            application.isHired = true;
            application.hiredDate = new Date();
            application.hiringEmailSent = true;
        } else {
            emailSubject = `Application Status Update - ${application.jobId.jobTitle}`;
            emailContent = `
                <h2>Dear ${application.fullName},</h2>
                <p>Thank you for your interest in the position of <strong>${application.jobId.jobTitle}</strong>.</p>
                <p>After careful consideration, we have decided not to move forward with your application at this time.</p>
                <p>We appreciate the time you invested in the application process and encourage you to apply for future opportunities.</p>
                <p>Best regards,<br>HR Team</p>
            `;

            application.status = 'rejected';
        }

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: emailSubject,
            html: emailContent
        });

        await application.save();

        res.status(200).json({
            success: true,
            message: `${decision === 'hired' ? 'Hiring' : 'Rejection'} email sent successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error sending email',
            error: error.message
        });
    }
};

export const processPayment = async (req, res) => {
    try {
        const { transactionId, amount } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (amount !== 1000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment amount'
            });
        }

        application.paymentCompleted = true;
        application.paymentTransactionId = transactionId;
        application.paymentDate = new Date();

        await application.save();

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

export const createEmployee = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId');

        if (!application || !application.paymentCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Application not found or payment not completed'
            });
        }

        if (application.employeeCreated) {
            return res.status(400).json({
                success: false,
                message: 'Employee already created for this application'
            });
        }

        // Generate employee code
        const employeeCount = await User.countDocuments({ role: 'employee' });
        const employeeCode = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

        // Create new employee
        const newEmployee = new User({
            employeeCode,
            username: application.fullName.toLowerCase().replace(/\s+/g, '.'),
            password: 'temporary123', // This will be hashed automatically
            role: 'employee',
            department: application.jobId.department,
            email: application.email,
            contact: application.phone,
            Salary: application.expectedSalary,
            createdBy: req.user.username
        });

        await newEmployee.save();

        // Update application
        application.employeeCreated = true;
        application.employeeId = newEmployee._id;
        await application.save();

        // Send welcome email with login credentials
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: application.email,
            subject: 'Welcome to the Company - Login Credentials',
            html: `
                <h2>Welcome ${application.fullName}!</h2>
                <p>Your employee account has been created successfully.</p>
                <p><strong>Employee Code:</strong> ${employeeCode}</p>
                <p><strong>Username:</strong> ${newEmployee.username}</p>
                <p><strong>Temporary Password:</strong> temporary123</p>
                <p>Please login and change your password immediately.</p>
                <p>Login URL: <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a></p>
            `
        });

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: {
                employee: newEmployee,
                application: application
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });
        const hiredApplications = await Application.countDocuments({ status: 'hired' });
        const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

        res.status(200).json({
            success: true,
            data: {
                totalJobs,
                activeJobs,
                totalApplications,
                pendingApplications,
                hiredApplications,
                rejectedApplications
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};