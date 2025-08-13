// models/AuditLog.js
const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        required: true
    },
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);