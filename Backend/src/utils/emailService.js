// utils/emailService.js
import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Send email function
export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: {
                name: process.env.COMPANY_NAME || 'Company HR',
                address: process.env.SMTP_USER
            },
            to: to,
            subject: subject,
            html: html,
            text: text || html.replace(/<[^>]*>/g, '') // Strip HTML for text version
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', {
            to: to,
            subject: subject,
            messageId: info.messageId
        });
        
        return {
            success: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Email sending error:', {
            to: to,
            subject: subject,
            error: error.message
        });
        
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Send bulk emails (for notifications to multiple HRs)
export const sendBulkEmail = async (emails) => {
    const results = [];
    
    for (const email of emails) {
        try {
            const result = await sendEmail(email);
            results.push({
                to: email.to,
                success: true,
                messageId: result.messageId
            });
        } catch (error) {
            results.push({
                to: email.to,
                success: false,
                error: error.message
            });
        }
    }
    
    return results;
};

// Email templates
export const emailTemplates = {
    hireNotification: (candidateName, jobTitle, confirmationUrl) => ({
        subject: `Congratulations! You've been selected for ${jobTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Congratulations ${candidateName}!</h2>
                <p>We are pleased to inform you that you have been selected for the position of <strong>${jobTitle}</strong>.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmationUrl}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        CONFIRM ACCEPTANCE
                    </a>
                </div>
                
                <p>This confirmation link is valid for 48 hours.</p>
                <p>Best regards,<br>HR Team</p>
            </div>
        `
    }),
    
    rejectNotification: (candidateName, jobTitle) => ({
        subject: `Update on your application for ${jobTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Application Update</h2>
                <p>Dear ${candidateName},</p>
                <p>Thank you for your interest in the <strong>${jobTitle}</strong> position.</p>
                <p>After careful consideration, we have decided to move forward with other candidates.</p>
                <p>We encourage you to apply for future opportunities.</p>
                <p>Best regards,<br>HR Team</p>
            </div>
        `
    }),
    
    paymentRequest: (candidateName, amount, paymentUrl) => ({
        subject: 'Payment Required to Complete Hiring Process',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #007bff;">Complete Your Hiring Process</h2>
                <p>Dear ${candidateName},</p>
                <p>To complete your hiring process, a processing fee of <strong>₹${amount}</strong> is required.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${paymentUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        PROCEED TO PAYMENT
                    </a>
                </div>
                
                <p>This link is valid for 48 hours.</p>
                <p>Best regards,<br>HR Team</p>
            </div>
        `
    })
};