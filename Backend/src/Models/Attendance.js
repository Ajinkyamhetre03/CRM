// models/Attendance.js
const attendanceStatuses = ['present', 'absent', 'half_day', 'late', 'work_from_home'];

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: Date,
    checkOut: Date,
    totalHours: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: attendanceStatuses,
        default: 'absent'
    },
    lateMinutes: {
        type: Number,
        default: 0
    },
    earlyLeaveMinutes: {
        type: Number,
        default: 0
    },
    location: String,
    notes: String,
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Compound index to ensure one record per employee per date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);