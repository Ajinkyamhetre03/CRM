// models/Project.js
import mongoose from "mongoose";

const projectStatuses = ['proposal', 'approved', 'in_progress', 'on_hold', 'completed', 'cancelled', 'rejected'];
const projectPriorities = ['low', 'medium', 'high', 'urgent'];

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^PRJ\d{3,}$/ // Example: PRJ001
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    businessRequirements: {
        type: String,
        required: true
    },
    // Business team creates initial proposal
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Manager assigned to handle project
    assignedManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Team members assigned
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    estimatedCost: {
        technology: { type: Number, default: 0 },
        manpower: { type: Number, default: 0 },
        resources: { type: Number, default: 0 }
    },
    finalCost: {
        type: Number,
        default: 0
    },
    approvedBudget: {
        type: Number,
        default: 0
    },
    estimatedDuration: {
        type: Number, // in days
        required: true
    },
    actualDuration: {
        type: Number // in days
    },
    estimatedTeamSize: {
        type: Number,
        required: true
    },
    startDate: Date,
    endDate: Date,
    deadline: Date,
    status: {
        type: String,
        enum: projectStatuses,
        default: 'proposal'
    },
    priority: {
        type: String,
        enum: projectPriorities,
        default: 'medium'
    },
    department: {
        type: String,
        enum: ['hr', 'iot', 'software', 'financial', 'business'],
        required: true
    },
    clientDetails: {
        name: String,
        email: String,
        contact: String,
        company: String
    },
    documents: [{
        name: String,
        url: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    milestones: [{
        title: String,
        description: String,
        dueDate: Date,
        completedDate: Date,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        }
    }],
    approvals: {
        managerApproval: {
            approved: { type: Boolean, default: false },
            approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            approvedAt: Date,
            comments: String
        },
        financialApproval: {
            approved: { type: Boolean, default: false },
            approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            approvedAt: Date,
            comments: String
        }
    }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);