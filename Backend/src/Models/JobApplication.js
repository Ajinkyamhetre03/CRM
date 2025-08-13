// models/JobApplication.js
const applicationStatuses = ['applied', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'withdrawn'];

const jobApplicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^APP\d{3,}$/ // Example: APP001
    },
    jobOpening: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobOpening',
        required: true
    },
    candidateName: {
        type: String,
        required: true,
        trim: true
    },
    candidateEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    candidateContact: {
        type: String,
        required: true,
        match: /^\+?\d{10,15}$/
    },
    resume: {
        filename: String,
        url: String
    },
    coverLetter: String,
    experience: Number,
    currentSalary: Number,
    expectedSalary: Number,
    noticePeriod: String,
    status: {
        type: String,
        enum: applicationStatuses,
        default: 'applied'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    interviewScheduled: {
        date: Date,
        time: String,
        interviewers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        location: String,
        notes: String
    },
    selectionDetails: {
        selected: { type: Boolean, default: false },
        offerLetter: String,
        joinDate: Date,
        confirmedJoining: { type: Boolean, default: false },
        confirmationToken: String,
        tokenExpiry: Date
    },
    hrNotes: String
}, { timestamps: true });

export default mongoose.model('JobApplication', jobApplicationSchema);