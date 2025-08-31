// models/Application.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    // Personal Information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
        type: String,
        required: true,
        match: /^\+?\d{10,15}$/
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    // Professional Information
    experience: {
        type: String,
        required: true
    },
    currentSalary: {
        type: Number,
        min: 0
    },
    expectedSalary: {
        type: Number,
        required: true,
        min: 0
    },
    noticePeriod: {
        type: String,
        required: true
    },
    // Education
    education: [{
        degree: String,
        institution: String,
        year: Number,
        percentage: Number
    }],
    // Skills and Experience
    skills: [{
        type: String,
        trim: true
    }],
    previousExperience: [{
        company: String,
        position: String,
        duration: String,
        responsibilities: String
    }],
    // Documents (as text/URLs instead of files)
    resumeUrl: {
        type: String,
        required: true
    },
    coverLetter: String,
    portfolioUrl: String,
    linkedinProfile: String,
    // Expression/Why interested
    whyInterested: {
        type: String,
        required: true,
        maxlength: 1000
    },
    // Application Status
    status: {
        type: String,
        enum: [
            'pending',
            'under_review',
            'shortlisted',
            'interview_scheduled',
            'hired',
            'rejected',
            'candidate_confirmed',
            'payment_pending',
            'payment_submitted',
            'payment_verified',
            'employee_created'
        ],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewDate: Date,
    hrComments: String,

    // Enhanced Hiring Process Tracking
    isHired: {
        type: Boolean,
        default: false
    },
    hiredDate: Date,

    // Candidate Confirmation Tracking
    candidateConfirmed: {
        type: Boolean,
        default: false
    },
    candidateConfirmationDate: Date,
    candidateConfirmationToken: String, // For secure confirmation links

    // Payment Tracking
    paymentRequired: {
        type: Boolean,
        default: false
    },
    paymentAmount: {
        type: Number,
        default: 1000
    },
    paymentCompleted: {
        type: Boolean,
        default: false
    },
    paymentTransactionId: String,
    paymentDate: Date,
    paymentVerified: {
        type: Boolean,
        default: false
    },
    paymentVerifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentVerificationDate: Date,
    paymentToken: String, // For secure payment links

    // Employee Creation
    employeeCreated: {
        type: Boolean,
        default: false
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Email Tracking
    emailsTracking: {
        hireRejectEmail: {
            sent: { type: Boolean, default: false },
            sentDate: Date,
            emailType: { type: String, enum: ['hire', 'reject'] }
        },
        candidateConfirmationEmail: {
            sent: { type: Boolean, default: false },
            sentDate: Date,
            opened: { type: Boolean, default: false },
            openedDate: Date
        },
        hrConfirmationEmail: {
            sent: { type: Boolean, default: false },
            sentDate: Date
        },
        paymentRequestEmail: {
            sent: { type: Boolean, default: false },
            sentDate: Date,
            opened: { type: Boolean, default: false },
            openedDate: Date
        },
        finalConfirmationEmail: {
            sent: { type: Boolean, default: false },
            sentDate: Date
        }
    },

    // Total email count
    totalEmailsSent: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for better query performance
applicationSchema.index({
    jobId: 1,
    status: 1,
    email: 1,
    candidateConfirmationToken: 1,
    paymentToken: 1
});

// Method to increment email count
applicationSchema.methods.incrementEmailCount = function () {
    this.totalEmailsSent += 1;
    return this.save();
};

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);