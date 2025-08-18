// controllers/hr.js
import Job from '../../../Models/Job.js';
import Application from '../../../Models/Application.js';
import User from '../../../Models/User.js';
import { sendEmail } from '../../../utils/emailService.js';
import crypto from 'crypto';

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
            .populate({
                path: "jobId", // Reference to Job schema
                select: "jobTitle department" // only required fields
            })

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching applications",
            error: error.message,
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


export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, hrComments } = req.body;
        const hrId = req.user.id;

        const application = await Application.findById(id).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update application
        application.status = status;
        application.hrComments = hrComments;
        application.reviewedBy = hrId;
        application.reviewDate = new Date();

        // Auto-trigger emails for hire/reject decisions
        if (status === 'hired' || status === 'rejected') {
            const emailType = status === 'hired' ? 'hire' : 'reject';

            // Generate confirmation token for hired candidates
            if (status === 'hired') {
                application.candidateConfirmationToken = crypto.randomBytes(32).toString('hex');
                application.isHired = true;
                application.hiredDate = new Date();
            }

            // Send email to candidate
            await sendHireRejectEmail(application, emailType);

            // Update email tracking
            application.emailsTracking.hireRejectEmail = {
                sent: true,
                sentDate: new Date(),
                emailType: emailType
            };
            application.totalEmailsSent += 1;
        }

        await application.save();

        res.status(200).json({
            message: 'Application status updated successfully',
            application,
            emailSent: status === 'hired' || status === 'rejected'
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send hire/reject email to candidate
const sendHireRejectEmail = async (application, emailType) => {
    const job = application.jobId;
    const isHired = emailType === 'hire';

    const subject = isHired
        ? `Congratulations! You've been selected for ${job.title}`
        : `Update on your application for ${job.title}`;

    let emailContent;

    if (isHired) {
        const confirmationUrl = `${process.env.CLIENT_URL}/applications/${application._id}/confirm-hiring/${application.candidateConfirmationToken}`;

        emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Congratulations ${application.fullName}!</h2>
                <p>We are pleased to inform you that you have been selected for the position of <strong>${job.title}</strong> at our company.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Job Details:</h3>
                    <p><strong>Position:</strong> ${job.title}</p>
                    <p><strong>Department:</strong> ${job.department}</p>
                    <p><strong>Salary:</strong> ${job.salaryRange}</p>
                </div>
                
                <p>To proceed with your hiring process, please confirm your acceptance by clicking the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        CONFIRM ACCEPTANCE
                    </a>
                </div>
                
                <p><strong>Important:</strong> This confirmation link is valid for 48 hours. After confirmation, you will receive further instructions for the onboarding process.</p>
                
                <p>If you have any questions, please don't hesitate to contact our HR team.</p>
                
                <p>Best regards,<br>HR Team</p>
            </div>
        `;
    } else {
        emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Application Update</h2>
                <p>Dear ${application.fullName},</p>
                <p>Thank you for your interest in the <strong>${job.title}</strong> position at our company.</p>
                
                <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current requirements.</p>
                
                <p>We appreciate the time you invested in the application process and encourage you to apply for future opportunities that match your skills and interests.</p>
                
                <p>Best regards,<br>HR Team</p>
            </div>
        `;
    }

    await sendEmail({
        to: application.email,
        subject,
        html: emailContent
    });
};

// Get candidate confirmations for HR dashboard
export const getCandidateConfirmations = async (req, res) => {
    try {
        const confirmations = await Application.find({
            status: { $in: ['hired', 'candidate_confirmed'] },
            isHired: true
        })
            .populate('jobId', 'title department')
            .select('fullName email status candidateConfirmed candidateConfirmationDate jobId hiredDate')
            .sort({ hiredDate: -1 });

        res.status(200).json({
            message: 'Candidate confirmations retrieved successfully',
            confirmations
        });
    } catch (error) {
        console.error('Get candidate confirmations error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Verify payment submitted by candidate
export const verifyPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { isValid, verificationNotes } = req.body;
        const hrId = req.user.id;

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.paymentTransactionId) {
            return res.status(400).json({ message: 'No payment submitted yet' });
        }

        // Update payment verification
        application.paymentVerified = isValid;
        application.paymentVerifiedBy = hrId;
        application.paymentVerificationDate = new Date();
        application.hrComments = (application.hrComments || '') + `\nPayment Verification: ${verificationNotes}`;

        if (isValid) {
            application.status = 'payment_verified';
        } else {
            application.status = 'payment_rejected';
        }

        await application.save();

        // Send email to candidate about payment status
        await sendPaymentVerificationEmail(application, isValid);

        res.status(200).json({
            message: `Payment ${isValid ? 'verified' : 'rejected'} successfully`,
            application
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send payment verification email
const sendPaymentVerificationEmail = async (application, isVerified) => {
    const subject = isVerified
        ? 'Payment Verified - Welcome to the Team!'
        : 'Payment Verification Failed';

    const emailContent = isVerified ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Payment Verified Successfully!</h2>
            <p>Dear ${application.fullName},</p>
            <p>Your payment has been successfully verified and you are now officially part of our team!</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Next Steps:</h3>
                <ul>
                    <li>You will receive your employee credentials within 24 hours</li>
                    <li>HR will contact you regarding your joining date</li>
                    <li>Please prepare the required documents for onboarding</li>
                </ul>
            </div>
            
            <p>Welcome aboard!</p>
            <p>Best regards,<br>HR Team</p>
        </div>
    ` : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Payment Verification Failed</h2>
            <p>Dear ${application.fullName},</p>
            <p>We were unable to verify your payment details. Please contact our HR team to resolve this issue.</p>
            <p>Best regards,<br>HR Team</p>
        </div>
    `;

    await sendEmail({
        to: application.email,
        subject,
        html: emailContent
    });

    // Update email tracking
    const application_updated = await Application.findById(application._id);
    application_updated.emailsTracking.finalConfirmationEmail = {
        sent: true,
        sentDate: new Date()
    };
    application_updated.totalEmailsSent += 1;
    await application_updated.save();
};

// Enhanced createEmployee function
export const createEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.paymentVerified) {
            return res.status(400).json({ message: 'Payment not verified yet' });
        }

        if (application.employeeCreated) {
            return res.status(400).json({ message: 'Employee already created' });
        }

        // Create employee user account
        const employee = new User({
            firstName: application.fullName.split(' ')[0],
            lastName: application.fullName.split(' ').slice(1).join(' '),
            email: application.email,
            phone: application.phone,
            role: 'employee',
            department: application.jobId.department,
            position: application.jobId.title,
            salary: application.expectedSalary,
            joiningDate: new Date(),
            // Generate temporary password
            password: crypto.randomBytes(8).toString('hex'),
            isActive: true
        });

        await employee.save();

        // Update application
        application.employeeCreated = true;
        application.employeeId = employee._id;
        application.status = 'employee_created';
        await application.save();

        // Send welcome email with credentials
        await sendWelcomeEmail(application, employee);

        res.status(201).json({
            message: 'Employee created successfully',
            employee: {
                id: employee._id,
                email: employee.email,
                department: employee.department,
                position: employee.position
            }
        });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send welcome email with credentials
const sendWelcomeEmail = async (application, employee) => {
    const subject = 'Welcome to the Team - Your Employee Credentials';

    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Welcome to Our Team!</h2>
            <p>Dear ${application.fullName},</p>
            <p>Congratulations! You are now officially an employee. Below are your login credentials:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Your Credentials:</h3>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Temporary Password:</strong> ${employee.password}</p>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Position:</strong> ${employee.position}</p>
                <p><strong>Employee ID:</strong> ${employee._id}</p>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p><strong>Important:</strong> Please change your password after first login for security purposes.</p>
            </div>
            
            <p>Your onboarding process will begin shortly. HR will contact you with further details.</p>
            
            <p>Welcome aboard!</p>
            <p>Best regards,<br>HR Team</p>
        </div>
    `;

    await sendEmail({
        to: application.email,
        subject,
        html: emailContent
    });
};

// Get email tracking statistics
export const getEmailTrackingStats = async (req, res) => {
    try {
        const stats = await Application.aggregate([
            {
                $group: {
                    _id: null,
                    totalApplications: { $sum: 1 },
                    totalEmailsSent: { $sum: '$totalEmailsSent' },
                    hireEmailsSent: {
                        $sum: {
                            $cond: [
                                { $eq: ['$emailsTracking.hireRejectEmail.emailType', 'hire'] },
                                1,
                                0
                            ]
                        }
                    },
                    rejectEmailsSent: {
                        $sum: {
                            $cond: [
                                { $eq: ['$emailsTracking.hireRejectEmail.emailType', 'reject'] },
                                1,
                                0
                            ]
                        }
                    },
                    candidateConfirmations: { $sum: { $cond: ['$candidateConfirmed', 1, 0] } },
                    paymentsCompleted: { $sum: { $cond: ['$paymentCompleted', 1, 0] } },
                    paymentsVerified: { $sum: { $cond: ['$paymentVerified', 1, 0] } },
                    employeesCreated: { $sum: { $cond: ['$employeeCreated', 1, 0] } }
                }
            }
        ]);

        res.status(200).json({
            message: 'Email tracking stats retrieved successfully',
            stats: stats[0] || {}
        });
    } catch (error) {
        console.error('Get email tracking stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};