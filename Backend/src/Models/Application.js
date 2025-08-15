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
        type: String, // URL to resume (Google Drive, LinkedIn, etc.)
        required: true
    },
    coverLetter: String, // Text-based cover letter
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
        enum: ['pending', 'under_review', 'shortlisted', 'interview_scheduled', 'hired', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewDate: Date,
    hrComments: String,
    // Hiring Process
    isHired: {
        type: Boolean,
        default: false
    },
    hiredDate: Date,
    hiringEmailSent: {
        type: Boolean,
        default: false
    },
    paymentCompleted: {
        type: Boolean,
        default: false
    },
    paymentTransactionId: String,
    paymentDate: Date,
    employeeCreated: {
        type: Boolean,
        default: false
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Index for better query performance
applicationSchema.index({ jobId: 1, status: 1, email: 1 });

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);
