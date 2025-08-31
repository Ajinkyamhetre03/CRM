// controllers/hr.js
import Job from '../../../Models/Job.js';
import Application from '../../../Models/Application.js';
import User from '../../../Models/User.js';
import { sendEmail } from '../../../utils/emailService.js';
import crypto from 'crypto';


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

export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting application',
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

// Professional email templates
const getEmailTemplate = (type, data) => {
    const baseStyle = `
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 650px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; }
            .content { padding: 40px 30px; }
            .highlight-box { background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin: 25px 0; border-radius: 4px; }
            .success-box { background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 25px 0; border-radius: 4px; }
            .info-box { background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 25px 0; border-radius: 4px; }
            .button { display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 20px 0; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3); }
            .footer { background-color: #343a40; color: #ffffff; padding: 25px 30px; text-align: center; font-size: 14px; }
            .job-details { background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .job-details h3 { color: #495057; margin-top: 0; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f8f9fa; }
            .detail-label { font-weight: 600; color: #6c757d; }
            .detail-value { color: #343a40; }
            .congratulations { font-size: 24px; color: #28a745; font-weight: 600; text-align: center; margin: 20px 0; }
            .company-logo { text-align: center; margin-bottom: 20px; }
        </style>
    `;

    const companyInfo = {
        name: process.env.COMPANY_NAME || 'TechCorp Solutions',
        address: process.env.COMPANY_ADDRESS || '123 Innovation Drive, Tech City, TC 12345',
        phone: process.env.COMPANY_PHONE || '+1 (555) 123-4567',
        email: process.env.COMPANY_EMAIL || 'hr@techcorp.com',
        website: process.env.COMPANY_WEBSITE || 'www.techcorp.com'
    };

    if (type === 'hire') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Job Offer - ${companyInfo.name}</title>
                ${baseStyle}
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="company-logo">
                            <h1>${companyInfo.name}</h1>
                        </div>
                    </div>
                    
                    <div class="content">
                        <div class="congratulations">
                            🎉 Congratulations ${data.application.fullName}! 🎉
                        </div>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                            We are delighted to extend an offer of employment for the position of <strong>${data.job.jobTitle}</strong> at ${companyInfo.name}. After careful consideration of your qualifications and interview performance, we believe you would be an excellent addition to our team.
                        </p>

                        <div class="success-box">
                            <h3 style="margin-top: 0; color: #155724;">🎯 Position Offer Details</h3>
                            <div class="job-details">
                                <div class="detail-row">
                                    <span class="detail-label">Position:</span>
                                    <span class="detail-value">${data.job.jobTitle}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Department:</span>
                                    <span class="detail-value">${data.job.department.charAt(0).toUpperCase() + data.job.department.slice(1)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Location:</span>
                                    <span class="detail-value">${data.job.jobLocation}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Work Schedule:</span>
                                    <span class="detail-value">${data.job.shift}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Experience Level:</span>
                                    <span class="detail-value">${data.job.experience}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Start Date:</span>
                                    <span class="detail-value">To be discussed during onboarding</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #0c5460;">📋 Next Steps</h3>
                            <p style="margin-bottom: 15px;">To proceed with your employment, please confirm your acceptance by clicking the button below within <strong>48 hours</strong>:</p>
                            
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="${data.confirmationUrl}" class="button" style="color: white; text-decoration: none;">
                                    Accept Job Offer
                                </a>
                            </div>
                            
                            <p style="margin-top: 15px; font-size: 14px; color: #6c757d;">
                                <strong>Important:</strong> This offer is contingent upon successful completion of background verification and submission of required documents during the onboarding process.
                            </p>
                        </div>

                        <div class="highlight-box">
                            <h3 style="margin-top: 0; color: #004085;">📞 Questions or Concerns?</h3>
                            <p>If you have any questions about this offer or need clarification on any details, please don't hesitate to contact our HR department:</p>
                            <p style="margin: 10px 0;">
                                📧 Email: <a href="mailto:${companyInfo.email}" style="color: #007bff;">${companyInfo.email}</a><br>
                                📱 Phone: <a href="tel:${companyInfo.phone}" style="color: #007bff;">${companyInfo.phone}</a>
                            </p>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6; color: #495057; margin-top: 30px;">
                            We look forward to welcoming you to the ${companyInfo.name} family and are excited about the contributions you will make to our team.
                        </p>

                        <p style="font-size: 16px; margin-top: 25px;">
                            Warm regards,<br>
                            <strong>Human Resources Department</strong><br>
                            ${companyInfo.name}
                        </p>
                    </div>

                    <div class="footer">
                        <p style="margin: 0; font-weight: 600;">${companyInfo.name}</p>
                        <p style="margin: 5px 0 0 0; opacity: 0.8;">${companyInfo.address}</p>
                        <p style="margin: 5px 0 0 0; opacity: 0.8;">
                            ${companyInfo.phone} | ${companyInfo.email} | ${companyInfo.website}
                        </p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.7;">
                            This email contains confidential information. If you received this in error, please delete it immediately.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    if (type === 'reject') {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Application Update - ${companyInfo.name}</title>
                ${baseStyle}
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="company-logo">
                            <h1>${companyInfo.name}</h1>
                        </div>
                    </div>
                    
                    <div class="content">
                        <h2 style="color: #495057; margin-bottom: 20px;">Application Status Update</h2>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                            Dear ${data.application.fullName},
                        </p>

                        <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                            Thank you for your interest in the <strong>${data.job.jobTitle}</strong> position at ${companyInfo.name} and for taking the time to participate in our selection process.
                        </p>

                        <div class="highlight-box">
                            <h3 style="margin-top: 0; color: #004085;">📋 Position Applied For</h3>
                            <div class="job-details">
                                <div class="detail-row">
                                    <span class="detail-label">Position:</span>
                                    <span class="detail-value">${data.job.jobTitle}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Department:</span>
                                    <span class="detail-value">${data.job.department.charAt(0).toUpperCase() + data.job.department.slice(1)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Location:</span>
                                    <span class="detail-value">${data.job.jobLocation}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Application Date:</span>
                                    <span class="detail-value">${new Date(data.application.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                            After careful review of all applications and thorough consideration of each candidate's qualifications, we have decided to move forward with other candidates whose experience and skills more closely align with our current requirements for this specific role.
                        </p>

                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #0c5460;">🚀 Future Opportunities</h3>
                            <p>We were impressed with your background and encourage you to:</p>
                            <ul style="margin: 15px 0; padding-left: 20px;">
                                <li>Keep an eye on our career portal for future openings that match your profile</li>
                                <li>Follow us on professional networks for company updates</li>
                                <li>Consider applying for other positions that align with your skills</li>
                            </ul>
                            <p style="text-align: center; margin: 20px 0;">
                                <a href="${companyInfo.website}/careers" style="color: #007bff; text-decoration: none; font-weight: 600;">
                                    🔍 Browse Current Openings
                                </a>
                            </p>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                            We genuinely appreciate the time and effort you invested in your application and the opportunity to learn about your professional background. We wish you continued success in your career journey.
                        </p>

                        <div class="highlight-box">
                            <p style="margin: 0; font-size: 14px; color: #6c757d; text-align: center;">
                                <strong>Thank you for considering ${companyInfo.name} as your potential employer.</strong>
                            </p>
                        </div>

                        <p style="font-size: 16px; margin-top: 25px;">
                            Best wishes,<br>
                            <strong>Talent Acquisition Team</strong><br>
                            ${companyInfo.name}
                        </p>
                    </div>

                    <div class="footer">
                        <p style="margin: 0; font-weight: 600;">${companyInfo.name}</p>
                        <p style="margin: 5px 0 0 0; opacity: 0.8;">${companyInfo.address}</p>
                        <p style="margin: 5px 0 0 0; opacity: 0.8;">
                            ${companyInfo.phone} | ${companyInfo.email} | ${companyInfo.website}
                        </p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.7;">
                            This email contains confidential information. If you received this in error, please delete it immediately.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
};

// Enhanced email sending function
const sendHireRejectEmail = async (application, emailType) => {
    try {
        const job = application.jobId;
        const isHired = emailType === 'hire';

        const subject = isHired
            ? `🎉 Job Offer: ${job.jobTitle} Position at ${process.env.COMPANY_NAME || 'TechCorp Solutions'}`
            : `Application Update: ${job.jobTitle} Position`;

        let confirmationUrl = null;
        if (isHired) {
            confirmationUrl = `${process.env.CLIENT_URL}/applications/${application._id}/confirm-hiring/${application.candidateConfirmationToken}`;
        }

        const emailContent = getEmailTemplate(emailType, {
            application,
            job,
            confirmationUrl
        });

        await sendEmail({
            to: application.email,
            subject,
            html: emailContent
        });

        console.log(`${emailType} email sent successfully to ${application.email} for job: ${job.jobTitle}`);
    } catch (error) {
        console.error(`Error sending ${emailType} email:`, error);
        throw new Error(`Failed to send ${emailType} email: ${error.message}`);
    }
};

// Get candidate confirmations for HR dashboard
// 1. GET API - Show candidates who submitted payment transactions
export const getCandidatesWithPayments = async (req, res) => {
    try {
        const candidatesWithPayments = await Application.find({
            paymentTransactionId: { $exists: true, $ne: null, $ne: '' },
            paymentCompleted: true,
            status: { $in: ['payment_submitted', 'payment_verified', 'payment_rejected'] }
        })
        .populate('jobId', 'jobTitle department jobLocation')
        .populate('paymentVerifiedBy', 'username email')
        .select(`
            fullName email phone jobId
            paymentTransactionId paymentAmount paymentDate paymentCompleted
            paymentVerified paymentVerifiedBy paymentVerificationDate
            status hiredDate candidateConfirmed
        `)
        .sort({ paymentDate: -1 });

        // Group by verification status
        const pendingVerification = candidatesWithPayments.filter(app => 
            !app.paymentVerified && app.status === 'payment_submitted'
        );
        
        const verifiedPayments = candidatesWithPayments.filter(app => 
            app.paymentVerified && app.status === 'payment_verified'
        );
        
        const rejectedPayments = candidatesWithPayments.filter(app => 
            app.status === 'payment_rejected'
        );

        res.status(200).json({
            success: true,
            message: 'Candidates with payment transactions retrieved successfully',
            data: {
                summary: {
                    totalCandidatesWithPayments: candidatesWithPayments.length,
                    pendingVerification: pendingVerification.length,
                    verifiedPayments: verifiedPayments.length,
                    rejectedPayments: rejectedPayments.length
                },
                candidates: {
                    all: candidatesWithPayments,
                    pendingVerification,
                    verifiedPayments,
                    rejectedPayments
                }
            }
        });

    } catch (error) {
        console.error('Get candidates with payments error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while retrieving candidates with payments', 
            error: error.message 
        });
    }
};

// Verify payment submitted by candidate
export const verifyPaymentTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { isValid, verificationNotes, rejectionReason } = req.body;
        const hrId = req.user?.id;

        // Validation
        if (!hrId) {
            return res.status(401).json({ 
                success: false,
                message: 'Unauthorized: HR user required' 
            });
        }

        if (typeof isValid !== 'boolean') {
            return res.status(400).json({ 
                success: false,
                message: 'isValid field is required and must be boolean' 
            });
        }

        const application = await Application.findById(id).populate('jobId', 'jobTitle department');
        
        if (!application) {
            return res.status(404).json({ 
                success: false,
                message: 'Application not found' 
            });
        }

        if (!application.paymentTransactionId || !application.paymentCompleted) {
            return res.status(400).json({ 
                success: false,
                message: 'No payment transaction found to verify' 
            });
        }

        if (application.paymentVerified === isValid && application.paymentVerificationDate) {
            return res.status(400).json({ 
                success: false,
                message: `Payment already ${isValid ? 'verified' : 'rejected'}` 
            });
        }

        // Update payment verification
        application.paymentVerified = isValid;
        application.paymentVerifiedBy = hrId;
        application.paymentVerificationDate = new Date();
        
        const hrComment = isValid 
            ? `Payment verified: ${verificationNotes || 'Payment approved'}`
            : `Payment rejected: ${rejectionReason || verificationNotes || 'Payment rejected'}`;
        
        application.hrComments = (application.hrComments || '') + `\n[${new Date().toISOString()}] ${hrComment}`;

        // Update status
        if (isValid) {
            application.status = 'payment_verified';
        } else {
            application.status = 'payment_rejected';
        }

        await application.save();

        // Send verification email to candidate
        await sendPaymentVerificationEmail(application, isValid, rejectionReason);

        // Update email tracking
        application.emailsTracking.finalConfirmationEmail = {
            sent: true,
            sentDate: new Date()
        };
        application.totalEmailsSent += 1;
        await application.save();

        res.status(200).json({
            success: true,
            message: `Payment ${isValid ? 'verified' : 'rejected'} successfully`,
            data: {
                applicationId: application._id,
                candidateName: application.fullName,
                transactionId: application.paymentTransactionId,
                verificationStatus: isValid ? 'verified' : 'rejected',
                verifiedBy: hrId,
                verificationDate: application.paymentVerificationDate
            }
        });

    } catch (error) {
        console.error('Verify payment transaction error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during payment verification', 
            error: error.message 
        });
    }
};

export const createEmployeeAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      temporaryPassword, 
      joiningDate, 
      salary 
    } = req.body;

    const application = await Application.findById(id)
      .populate("jobId", "jobTitle department jobLocation")
      .populate("paymentVerifiedBy", "username");

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: "Application not found" 
      });
    }

    // ✅ Validation checks (kept same)
    if (!application.paymentVerified) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment not verified yet. Cannot create employee account." 
      });
    }

    if (application.employeeCreated) {
      return res.status(400).json({ 
        success: false, 
        message: "Employee account already exists for this candidate",
        data: { employeeId: application.employeeId }
      });
    }

    if (!application.candidateConfirmed) {
      return res.status(400).json({ 
        success: false, 
        message: "Candidate has not confirmed acceptance yet" 
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: application.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // ✅ Generate Employee Code (New way)
    const employeeCode = await getEmployeeCode(
      application.jobId.department,
      "employee" // default role for new hires
    );

    // ✅ Generate username
    const baseUsername = application.fullName.toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // ✅ Create new employee
    const employee = new User({
      employeeCode,
      username,
      password: temporaryPassword || crypto.randomBytes(8).toString("hex"),
      email: application.email,
      contact: application.phone,
      role: "employee",
      department: application.jobId.department,
      Salary: salary || application.expectedSalary || 0,
      dateOfJoining: joiningDate ? new Date(joiningDate) : new Date(),
      status: "active",
      accountType: true,
      createdBy: req.user?.username || "HR System",
    });

    await employee.save();

    // ✅ Update Application
    application.employeeCreated = true;
    application.employeeId = employee._id;
    application.status = "employee_created";
    application.hrComments =
      (application.hrComments || "") +
      `\n[${new Date().toISOString()}] Employee account created - ID: ${employee.employeeCode}`;

    await application.save();

    // ✅ Send Welcome Email
    await sendWelcomeEmailWithCredentials(application, employee, temporaryPassword);

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "Employee account created successfully",
      data: {
        employee: {
          id: employee._id,
          employeeCode: employee.employeeCode,
          username: employee.username,
          email: employee.email,
          department: employee.department,
          role: employee.role,
          joiningDate: employee.dateOfJoining,
        },
        application: {
          id: application._id,
          status: application.status,
          candidateName: application.fullName,
        },
      },
    });
  } catch (error) {
    console.error("Create employee account error:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Employee with this ${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during employee creation",
      error: error.message,
    });
  }
};



// Generate Department + Role Codes
const getEmployeeCode = async (department, role) => {
  const deptCodes = {
    hr: "HR",
    iot: "IO",
    software: "SW",
    financial: "FN",
    business: "BN",
    goble: "GB",
    ceo: "CE",
    superadmin: "SA",
    admin: "AM",
  };

  const roleCodes = {
    manager: "M",
    employee: "E",
    intern: "I",
  };

  // Pick codes (fallbacks ensure safety)
  const deptCode = deptCodes[department] || "GN";
  const roleCode = roleCodes[role] || "";

  // Year (last two digits)
  const year = new Date().getFullYear().toString().slice(-2);

  // Auto increment by counting users in same dept + role
  const count = await User.countDocuments({ department, role }) + 1;
  const sequence = count.toString().padStart(3, "0");

  return `EMP${year}${deptCode}${roleCode}${sequence}`;
};


export const getEmailTrackingById = async (req, res) => {
    try {
        const applicationId = req.params.id;

        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Application ID parameter is required'
            });
        }

        const application = await Application.findById(applicationId)
            .select('fullName email emailsTracking candidateConfirmed paymentCompleted paymentVerified employeeCreated totalEmailsSent')
            .lean();

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found with the provided ID'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Email tracking details fetched successfully',
            data: {
                fullName: application.fullName,
                email: application.email,
                totalEmailsSent: application.totalEmailsSent,
                emailsTracking: application.emailsTracking,
                candidateConfirmed: application.candidateConfirmed,
                paymentCompleted: application.paymentCompleted,
                paymentVerified: application.paymentVerified,
                employeeCreated: application.employeeCreated
            }
        });

    } catch (error) {
        console.error('Error fetching email tracking by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving email tracking details',
            error: error.message
        });
    }
};


// Send payment verification email
const sendPaymentVerificationEmail = async (application, isVerified, rejectionReason) => {
    try {
        const subject = isVerified
            ? 'Payment Verified - Welcome to the Team!'
            : 'Payment Verification Failed - Action Required';

        const emailContent = isVerified ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #28a745; margin: 0;">✅ Payment Verified Successfully!</h2>
                </div>
                
                <p style="font-size: 16px;">Dear ${application.fullName},</p>
                
                <p>Great news! Your payment has been successfully verified and you are now officially part of our team!</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin-top: 0; color: #28a745;">What's Next:</h3>
                    <ul style="margin: 10px 0;">
                        <li>Your employee credentials will be sent within 24 hours</li>
                        <li>HR will contact you regarding your joining date</li>
                        <li>Please prepare required documents for onboarding</li>
                        <li>Welcome orientation details will follow soon</li>
                    </ul>
                </div>
                
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Job Position:</strong> ${application.jobId?.jobTitle || 'N/A'}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Department:</strong> ${application.jobId?.department || 'N/A'}</p>
                </div>
                
                <p>We're excited to have you join our team!</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>HR Team</strong>
                </p>
            </div>
        ` : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #dc3545; margin: 0;">❌ Payment Verification Failed</h2>
                </div>
                
                <p style="font-size: 16px;">Dear ${application.fullName},</p>
                
                <p>We were unable to verify your payment details for the following reason:</p>
                
                <div style="background-color: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <p style="margin: 0; color: #721c24;">
                        <strong>Reason:</strong> ${rejectionReason || 'Payment verification failed'}
                    </p>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Next Steps:</h3>
                    <ul style="margin: 10px 0;">
                        <li>Please contact our HR team immediately</li>
                        <li>Provide correct payment details</li>
                        <li>Submit valid transaction proof</li>
                    </ul>
                </div>
                
                <p>Please reach out to us as soon as possible to resolve this issue.</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>HR Team</strong>
                </p>
            </div>
        `;

        await sendEmail({
            to: application.email,
            subject,
            html: emailContent
        });

    } catch (error) {
        console.error('Send payment verification email error:', error);
    }
};

// Send welcome email with employee credentials
const sendWelcomeEmailWithCredentials = async (application, employee, temporaryPassword) => {
    try {
        const subject = 'Welcome to the Team - Your Employee Credentials';

        const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #28a745; margin: 0;">🎉 Welcome to Our Team!</h2>
                </div>
                
                <p style="font-size: 16px;">Dear ${application.fullName},</p>
                
                <p>Congratulations! You are now officially an employee. Below are your login credentials and important details:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #28a745;">
                    <h3 style="margin-top: 0; color: #28a745;">🔐 Your Login Credentials:</h3>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; font-family: monospace;">
                        <p style="margin: 5px 0;"><strong>Employee ID:</strong> ${employee.employeeCode}</p>
                        <p style="margin: 5px 0;"><strong>Username:</strong> ${employee.username}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${employee.email}</p>
                        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${temporaryPassword || employee.password}</p>
                    </div>
                </div>
                
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">👤 Employee Details:</h3>
                    <p style="margin: 5px 0;"><strong>Department:</strong> ${employee.department}</p>
                    <p style="margin: 5px 0;"><strong>Role:</strong> ${employee.role}</p>
                    <p style="margin: 5px 0;"><strong>Joining Date:</strong> ${employee.dateOfJoining.toDateString()}</p>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="margin-top: 0;">⚠️ Important Security Notice:</h3>
                    <ul style="margin: 10px 0;">
                        <li><strong>Change your password</strong> immediately after first login</li>
                        <li>Keep your credentials secure and confidential</li>
                        <li>Never share your login details with anyone</li>
                        <li>Contact IT support if you face any login issues</li>
                    </ul>
                </div>
                
                <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">📋 Next Steps:</h3>
                    <ul style="margin: 10px 0;">
                        <li>Complete your employee onboarding process</li>
                        <li>Attend the orientation session (details will follow)</li>
                        <li>Submit any pending documentation</li>
                        <li>Meet your team and supervisor on your first day</li>
                    </ul>
                </div>
                
                <p>We're excited to have you as part of our team and look forward to working with you!</p>
                
                <p style="margin-top: 30px;">
                    Welcome aboard!<br>
                    <strong>HR Team</strong>
                </p>
            </div>
        `;

        await sendEmail({
            to: application.email,
            subject,
            html: emailContent
        });

    } catch (error) {
        console.error('Send welcome email error:', error);
    }
};