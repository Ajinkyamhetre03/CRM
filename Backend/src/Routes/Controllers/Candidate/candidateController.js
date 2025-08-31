// Controllers/Candidate/candidateController.js

import Application from '../../../Models/Application.js';
import Job from '../../../Models/Job.js';
import { sendEmail } from '../../../utils/emailService.js';

// Add this import at the top of your file
import crypto from 'crypto';

export const confirmHiring = async (req, res) => { 
    try { 
        const { applicationId, token } = req.params; 
        console.log("📩 Confirm Hiring HIT:", { applicationId, token }); 
         
        // ✅ Add validation for token and applicationId 
        if (!applicationId || !token) { 
            return res.status(400).json({ 
                message: 'Missing application ID or confirmation token' 
            }); 
        } 
 
        const application = await Application.findOne({ 
            _id: applicationId, 
            candidateConfirmationToken: token, 
            isHired: true 
        }).populate('jobId'); 
 
        if (!application) { 
            return res.status(404).json({ 
                message: 'Invalid confirmation link or application not found' 
            }); 
        } 
 
        // Check if already confirmed 
        if (application.candidateConfirmed) { 
            return res.status(400).json({ 
                message: 'You have already confirmed this hiring offer' 
            }); 
        } 
 
        // Update confirmation status 
        application.candidateConfirmed = true; 
        application.candidateConfirmationDate = new Date(); 
        application.status = 'candidate_confirmed'; 
 
        // Generate payment token for next step 
        application.paymentToken = crypto.randomBytes(32).toString('hex'); 
        application.paymentRequired = true; 
 
        await application.save(); 
 
        // Send payment request email to candidate 
        await sendPaymentRequestEmail(application); 
 
        // ✅ Update email tracking 
        application.emailsTracking.candidateConfirmationEmail = { 
            sent: true, 
            sentDate: new Date(), 
            opened: true, // User clicked the confirmation link 
            openedDate: new Date() 
        }; 
        application.totalEmailsSent += 1; 
        await application.save(); 
 
        res.status(200).json({ 
            message: 'Hiring confirmation successful! Payment instructions have been sent to your email.', 
            nextStep: 'payment_required', 
            application: { 
                id: application._id, 
                status: application.status, 
                paymentRequired: application.paymentRequired, 
                paymentAmount: application.paymentAmount 
            } 
        }); 
    } catch (error) { 
        console.error('Confirm hiring error:', error); 
        res.status(500).json({ message: 'Server error', error: error.message }); 
    } 
};



// Send payment request email to candidate
const sendPaymentRequestEmail = async (application) => {
    const paymentUrl = `${process.env.CLIENT_URL}/applications/${application._id}/payment-details/${application.paymentToken}`;

    const subject = 'Payment Required to Complete Your Hiring Process';

    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Complete Your Hiring Process</h2>
            <p>Dear ${application.fullName},</p>
            <p>Thank you for confirming your acceptance! To complete your hiring process, a processing fee is required.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Payment Details:</h3>
                <p><strong>Amount:</strong> ₹${application.paymentAmount}</p>
                <p><strong>Purpose:</strong> Hiring Processing Fee</p>
                <p><strong>Position:</strong> ${application.jobId.title}</p>
            </div>
            
            <p>Click the button below to proceed with payment:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    PROCEED TO PAYMENT
                </a>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p><strong>Important:</strong></p>
                <ul>
                    <li>This payment link is valid for 48 hours</li>
                    <li>You will need to provide a transaction ID after payment</li>
                    <li>HR will verify your payment before final confirmation</li>
                    <li>This is a one-time processing fee</li>
                </ul>
            </div>
            
            <p>If you have any questions about the payment process, please contact our HR team.</p>
            
            <p>Best regards,<br>HR Team</p>
        </div>
    `;

    await sendEmail({
        to: application.email,
        subject,
        html: emailContent
    });

    // Update email tracking
    application.emailsTracking.paymentRequestEmail = {
        sent: true,
        sentDate: new Date()
    };
    application.totalEmailsSent += 1;
    await application.save();
};

// Get application details for payment page
export const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId, token } = req.params;

        const application = await Application.findOne({
            _id: applicationId,
            paymentToken: token,
            candidateConfirmed: true
        }).populate('jobId', 'title department salaryRange location');

        if (!application) {
            return res.status(404).json({ 
                message: 'Invalid payment link or application not found' 
            });
        }

        // Check if payment already completed
        if (application.paymentCompleted) {
            return res.status(200).json({
                message: 'Payment already completed',
                status: 'payment_completed',
                application: {
                    fullName: application.fullName,
                    email: application.email,
                    jobTitle: application.jobId.title,
                    paymentAmount: application.paymentAmount,
                    paymentDate: application.paymentDate,
                    transactionId: application.paymentTransactionId
                }
            });
        }

        res.status(200).json({
            message: 'Application details retrieved successfully',
            application: {
                id: application._id,
                fullName: application.fullName,
                email: application.email,
                phone: application.phone,
                jobDetails: {
                    title: application.jobId.title,
                    department: application.jobId.department,
                    salaryRange: application.jobId.salaryRange,
                    location: application.jobId.location
                },
                paymentRequired: application.paymentRequired,
                paymentAmount: application.paymentAmount,
                expectedSalary: application.expectedSalary
            }
        });
    } catch (error) {
        console.error('Get application details error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Submit payment details by candidate
export const submitPaymentDetails = async (req, res) => {
    try {
        const { applicationId, token } = req.params;
        const { transactionId, paymentMethod, paymentDate, paymentScreenshot } = req.body;

        if (!transactionId || !paymentMethod) {
            return res.status(400).json({
                message: 'Transaction ID and payment method are required'
            });
        }

        const application = await Application.findOne({
            _id: applicationId,
            paymentToken: token,
            candidateConfirmed: true
        });

        if (!application) {
            return res.status(404).json({
                message: 'Invalid payment link or application not found' 
            });
        }

        if (application.paymentCompleted) {
            return res.status(400).json({ 
                message: 'Payment already submitted for this application' 
            });
        }

        // Update payment details
        application.paymentTransactionId = transactionId;
        application.paymentCompleted = true;
        application.paymentDate = paymentDate || new Date();
        application.status = 'payment_submitted';

        // Store additional payment info
        application.paymentDetails = {
            method: paymentMethod,
            screenshot: paymentScreenshot || null,
            submittedDate: new Date()
        };

        await application.save();

        // Send confirmation email to candidate
        await sendPaymentSubmissionConfirmation(application);

        // Notify HR about payment submission
        await sendHRPaymentNotification(application);

        res.status(200).json({
            message: 'Payment details submitted successfully! HR will verify your payment shortly.',
            status: 'payment_submitted',
            transactionId: transactionId,
            nextStep: 'awaiting_verification'
        });
    } catch (error) {
        console.error('Submit payment details error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send payment submission confirmation to candidate
const sendPaymentSubmissionConfirmation = async (application) => {
    const subject = 'Payment Received - Under Verification';

    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">Payment Submission Confirmed</h2>
            <p>Dear ${application.fullName},</p>
            <p>We have received your payment details for the hiring process.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Payment Details:</h3>
                <p><strong>Transaction ID:</strong> ${application.paymentTransactionId}</p>
                <p><strong>Amount:</strong> ₹${application.paymentAmount}</p>
                <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Status:</strong> Under Verification</p>
            </div>
            
            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #bee5eb;">
                <p><strong>What's Next?</strong></p>
                <p>Our HR team will verify your payment within 24-48 hours. You will receive an email confirmation once verification is complete.</p>
            </div>
            
            <p>Thank you for your patience!</p>
            <p>Best regards,<br>HR Team</p>
        </div>
    `;

    await sendEmail({
        to: application.email,
        subject,
        html: emailContent
    });
};

// Send HR notification about payment submission
const sendHRPaymentNotification = async (application) => {
    const subject = `Payment Submitted: ${application.fullName} - Verification Required`;

    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ffc107;">Payment Verification Required</h2>
            <p>A candidate has submitted payment details that require verification.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3>Candidate & Payment Details:</h3>
                <p><strong>Name:</strong> ${application.fullName}</p>
                <p><strong>Email:</strong> ${application.email}</p>
                <p><strong>Position:</strong> ${application.jobId?.title || 'N/A'}</p>
                <p><strong>Transaction ID:</strong> ${application.paymentTransactionId}</p>
                <p><strong>Amount:</strong> ₹${application.paymentAmount}</p>
                <p><strong>Payment Method:</strong> ${application.paymentDetails?.method || 'N/A'}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/hr/applications/${application._id}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    VERIFY PAYMENT
                </a>
            </div>
            
            <p><strong>Action Required:</strong> Please verify this payment in the HR dashboard and update the application status accordingly.</p>

            <p>Best regards,<br>System Notification</p>
        </div>
    `;

    await sendEmail({
        to: process.env.HR_EMAIL || 'hr@company.com',
        subject,
        html: emailContent
    });
};

const getDetailedStatusInfo = (application) => {
    let info = {};
    switch (application.status) {
        case 'pending':
            info = { stage: "Pending", description: "Your application has been received and is awaiting review." };
            break;
        case 'under_review':
            info = { stage: "Under Review", description: "HR is currently reviewing your application." };
            break;
        case 'shortlisted':
            info = { stage: "Shortlisted", description: "You have been shortlisted for the next round." };
            break;
        case 'interview_scheduled':
            info = { stage: "Interview Scheduled", description: "Your interview has been scheduled. Please check your email for details." };
            break;
        case 'hired':
            info = { stage: "Hired", description: "Congratulations! You have been hired." };
            break;
        case 'rejected':
            info = { stage: "Rejected", description: "Unfortunately, your application was not selected." };
            break;
        case 'candidate_confirmed':
            info = { stage: "Candidate Confirmed", description: "You have confirmed your interest in the role." };
            break;
        case 'payment_pending':
            info = { stage: "Payment Pending", description: "Payment is required to proceed." };
            break;
        case 'payment_submitted':
            info = { stage: "Payment Submitted", description: "Your payment has been submitted. Awaiting verification." };
            break;
        case 'payment_verified':
            info = { stage: "Payment Verified", description: "Your payment has been verified." };
            break;
        case 'employee_created':
            info = { stage: "Employee Created", description: "Your employee profile has been created in the system." };
            break;
        default:
            info = { stage: "Unknown", description: "Application status is not recognized." };
    }
    return info;
};



export const getActiveJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: 'active',
            applicationDeadline: { $gte: new Date() }
        }).select('-createdBy -updatedBy');

        res.status(200).json({
            message: 'Active jobs retrieved successfully',
            data: jobs
        });
    } catch (error) {
        console.error('Get active jobs error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getJobDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).select('-createdBy -updatedBy');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({
            message: 'Job details retrieved successfully',
            data: job
        });
    } catch (error) {
        console.error('Get job details error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const submitApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applicationData = req.body;

        // Check if job exists and is active
        const job = await Job.findOne({ _id: jobId, status: 'active' });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or not active' });
        }

        // Check for duplicate application
        const existingApplication = await Application.findOne({
            jobId: jobId,
            email: applicationData.email.toLowerCase()
        });

        if (existingApplication) {
            return res.status(400).json({
                message: 'You have already applied for this position'
            });
        }

        // Create new application
        const application = new Application({
            ...applicationData,
            jobId: jobId,
            email: applicationData.email.toLowerCase()
        });

        await application.save();

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: application._id,
            status: application.status
        });
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const myApplication = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // ✅ Use find, not findOne
        const applications = await Application.find({ email: email.toLowerCase() })
            .populate("jobId", "title department location")
            .select("-candidateConfirmationToken -paymentToken");

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "No applications found for this email" });
        }

        // ✅ Map over all applications
        const formattedApplications = applications.map(app => ({
            id: app._id,
            fullName: app.fullName,
            email: app.email,
            jobTitle: app.jobId?.title,
            department: app.jobId?.department,
            location: app.jobId?.location,
            status: app.status,
            statusInfo: getDetailedStatusInfo(app), // dynamic status details
            appliedDate: app.createdAt,
            lastUpdated: app.updatedAt,
            isHired: app.isHired,
            candidateConfirmed: app.candidateConfirmed,
            paymentRequired: app.paymentRequired,
            paymentCompleted: app.paymentCompleted,
            paymentVerified: app.paymentVerified,
            employeeCreated: app.employeeCreated
        }));

        // ✅ Return all applications in array
        res.status(200).json({
            message: "Applications retrieved successfully",
            count: formattedApplications.length,
            applications: formattedApplications
        });

    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Legacy functions (keep for backward compatibility)
export const completePayment = async (req, res) => {
    // Redirect to new payment flow
    return res.status(301).json({
        message: 'This endpoint has been moved. Please use the payment link sent to your email.',
        newEndpoint: `/applications/${req.params.applicationId}/payment-details/{token}`
    });
};

export const setupEmployeeAccount = async (req, res) => {
    // This is now handled automatically after payment verification
    return res.status(410).json({
        message: 'This endpoint is no longer used. Employee accounts are created automatically after payment verification.'
    });
};