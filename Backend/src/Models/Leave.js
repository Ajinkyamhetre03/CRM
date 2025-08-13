// models/Leave.js
const leaveTypes = ['sick', 'casual', 'vacation', 'maternity', 'paternity', 'emergency', 'compensatory'];
const leaveStatuses = ['pending', 'approved', 'rejected', 'cancelled'];

const leaveSchema = new mongoose.Schema({
    leaveId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^LV\d{3,}$/ // Example: LV001
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: leaveTypes,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: leaveStatuses,
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedDate: Date,
    rejectionReason: String,
    documents: [{
        name: String,
        url: String
    }]
}, { timestamps: true });

export default mongoose.model('Leave', leaveSchema);