// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    jobLocation: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        required: true,
        trim: true
    },
    shift: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        enum: ['hr', 'iot', 'software', 'financial', 'business'],
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    keyResponsibilities: [{
        type: String,
        required: true
    }],
    requiredSkills: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'closed'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    maxApplications: {
        type: Number,
        default: 100
    },
    currentApplications: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Index for better search performance
jobSchema.index({ jobTitle: 1, department: 1, status: 1 });

// ✅ Prevent OverwriteModelError
export default mongoose.models.Job || mongoose.model('Job', jobSchema);
