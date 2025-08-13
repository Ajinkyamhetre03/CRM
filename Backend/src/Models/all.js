// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, // Job title is mandatory
        trim: true
    },
    location: {
        type: String,
        required: true, // e.g., "Hinjewadi Phase-1, Pune (WFO)"
        trim: true
    },
    experience: {
        type: String, // e.g., "0.5-1 Years"
        required: true
    },
    shift: {
        type: String, // e.g., "12.00PM - 9.00 PM IST Monday to Friday"
        required: true
    },
    description: {
        type: String, // Main job description
        required: true
    },
    keyResponsibilities: [
        {
            type: String, // List of responsibilities
            required: true
        }
    ],
    requiredSkills: [
        {
            type: String, // List of skills
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now // Auto-set creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean, // To mark if job is open or closed
        default: true
    }
});

// Optional: update `updatedAt` automatically on save
jobSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
