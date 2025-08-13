// models/Notification.js
const notificationTypes = ['project', 'task', 'leave', 'expense', 'payroll', 'announcement', 'reminder'];

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: notificationTypes,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedDocument: {
        model: String,
        documentId: mongoose.Schema.Types.ObjectId
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    expiresAt: Date
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);