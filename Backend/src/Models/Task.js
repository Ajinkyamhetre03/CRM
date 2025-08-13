const taskStatuses = ['todo', 'in_progress', 'review', 'completed', 'cancelled'];
const taskPriorities = ['low', 'medium', 'high', 'urgent'];

const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^TSK\d{3,}$/ // Example: TSK001
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: taskStatuses,
        default: 'todo'
    },
    priority: {
        type: String,
        enum: taskPriorities,
        default: 'medium'
    },
    estimatedHours: {
        type: Number,
        required: true
    },
    actualHours: {
        type: Number,
        default: 0
    },
    startDate: Date,
    dueDate: {
        type: Date,
        required: true
    },
    completedDate: Date,
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);