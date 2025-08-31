import Application from '../../../Models/Application.js';

export const getEmailTrackingStats = async (req, res) => {
    try {
        // Get comprehensive email statistics
        const emailStats = await Application.aggregate([
            {
                $group: {
                    _id: null,
                    totalApplications: { $sum: 1 },
                    totalEmailsSent: { $sum: '$totalEmailsSent' },
                    
                    // Hire/Reject emails
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
                    
                    // Confirmation emails
                    candidateConfirmationEmailsSent: {
                        $sum: { $cond: ['$emailsTracking.candidateConfirmationEmail.sent', 1, 0] }
                    },
                    candidateConfirmationEmailsOpened: {
                        $sum: { $cond: ['$emailsTracking.candidateConfirmationEmail.opened', 1, 0] }
                    },
                    
                    // HR emails
                    hrConfirmationEmailsSent: {
                        $sum: { $cond: ['$emailsTracking.hrConfirmationEmail.sent', 1, 0] }
                    },
                    
                    // Payment emails
                    paymentRequestEmailsSent: {
                        $sum: { $cond: ['$emailsTracking.paymentRequestEmail.sent', 1, 0] }
                    },
                    paymentRequestEmailsOpened: {
                        $sum: { $cond: ['$emailsTracking.paymentRequestEmail.opened', 1, 0] }
                    },
                    
                    // Final confirmation emails
                    finalConfirmationEmailsSent: {
                        $sum: { $cond: ['$emailsTracking.finalConfirmationEmail.sent', 1, 0] }
                    },
                    
                    // Process statistics
                    candidateConfirmations: { $sum: { $cond: ['$candidateConfirmed', 1, 0] } },
                    paymentsCompleted: { $sum: { $cond: ['$paymentCompleted', 1, 0] } },
                    paymentsVerified: { $sum: { $cond: ['$paymentVerified', 1, 0] } },
                    employeesCreated: { $sum: { $cond: ['$employeeCreated', 1, 0] } }
                }
            }
        ]);

        // Get department-wise statistics
        const departmentStats = await Application.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: '$job' },
            {
                $group: {
                    _id: '$job.department',
                    applications: { $sum: 1 },
                    emailsSent: { $sum: '$totalEmailsSent' },
                    hired: { $sum: { $cond: ['$isHired', 1, 0] } },
                    employeesCreated: { $sum: { $cond: ['$employeeCreated', 1, 0] } }
                }
            }
        ]);

        // Get recent email activity
        const recentEmailActivity = await Application.find({
            $or: [
                { 'emailsTracking.hireRejectEmail.sent': true },
                { 'emailsTracking.candidateConfirmationEmail.sent': true },
                { 'emailsTracking.paymentRequestEmail.sent': true },
                { 'emailsTracking.finalConfirmationEmail.sent': true }
            ]
        })
        .populate('jobId', 'jobTitle department')
        .select('fullName email totalEmailsSent emailsTracking createdAt')
        .sort({ updatedAt: -1 })
        .limit(20);

        const stats = emailStats[0] || {};
        
        // Calculate email open rates
        const candidateConfirmationOpenRate = stats.candidateConfirmationEmailsSent > 0 
            ? ((stats.candidateConfirmationEmailsOpened / stats.candidateConfirmationEmailsSent) * 100).toFixed(2)
            : 0;
            
        const paymentRequestOpenRate = stats.paymentRequestEmailsSent > 0
            ? ((stats.paymentRequestEmailsOpened / stats.paymentRequestEmailsSent) * 100).toFixed(2)
            : 0;

        res.status(200).json({
            success: true,
            message: 'Email tracking statistics retrieved successfully',
            data: {
                summary: {
                    totalApplications: stats.totalApplications || 0,
                    totalEmailsSent: stats.totalEmailsSent || 0,
                    candidateConfirmations: stats.candidateConfirmations || 0,
                    paymentsCompleted: stats.paymentsCompleted || 0,
                    paymentsVerified: stats.paymentsVerified || 0,
                    employeesCreated: stats.employeesCreated || 0
                },
                emailBreakdown: {
                    hireEmails: stats.hireEmailsSent || 0,
                    rejectEmails: stats.rejectEmailsSent || 0,
                    candidateConfirmationEmails: stats.candidateConfirmationEmailsSent || 0,
                    hrConfirmationEmails: stats.hrConfirmationEmailsSent || 0,
                    paymentRequestEmails: stats.paymentRequestEmailsSent || 0,
                    finalConfirmationEmails: stats.finalConfirmationEmailsSent || 0
                },
                openRates: {
                    candidateConfirmationOpenRate: `${candidateConfirmationOpenRate}%`,
                    paymentRequestOpenRate: `${paymentRequestOpenRate}%`
                },
                departmentStats,
                recentActivity: recentEmailActivity
            }
        });

    } catch (error) {
        console.error('Get email tracking stats error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while retrieving email statistics', 
            error: error.message 
        });
    }
};