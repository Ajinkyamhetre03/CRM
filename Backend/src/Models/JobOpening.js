// models/JobOpening.js
const jobStatuses = ['active', 'closed', 'on_hold'];
const experienceLevels = ['fresher', 'junior', 'mid', 'senior', 'lead'];

const jobOpeningSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^JOB\d{3,}$/ // Example: JOB001
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
    department: {
        type: String,
        enum: ['hr', 'iot', 'software', 'financial', 'business'],
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'hr', 'manager', 'employee', 'intern'],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: experienceLevels,
        required: true
    },
    minExperience: {
        type: Number,
        default: 0
    },
    maxExperience: {
        type: Number,
        default: 10
    },
    skills: [String],
    qualifications: [String],
    salaryRange: {
        min: Number,
        max: Number
    },
    location: String,
    jobType: {
        type: String,
        enum: ['full_time', 'part_time', 'contract', 'internship'],
        default: 'full_time'
    },
    status: {
        type: String,
        enum: jobStatuses,
        default: 'active'
    },
    openings: {
        type: Number,
        required: true,
        min: 1
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationDeadline: Date,
    requirements: String,
    benefits: [String]
}, { timestamps: true });

export default mongoose.model('JobOpening', jobOpeningSchema);