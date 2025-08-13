// models/Expense.js
const expenseTypes = ['travel', 'office_supplies', 'software', 'hardware', 'training', 'marketing', 'utilities', 'others'];
const expenseStatuses = ['pending', 'approved', 'rejected', 'reimbursed'];

const expenseSchema = new mongoose.Schema({
    expenseId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^EXP\d{3,}$/ // Example: EXP001
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    expenseType: {
        type: String,
        enum: expenseTypes,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    expenseDate: {
        type: Date,
        required: true
    },
    receipts: [{
        filename: String,
        url: String
    }],
    status: {
        type: String,
        enum: expenseStatuses,
        default: 'pending'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedDate: Date,
    rejectionReason: String,
    reimbursedDate: Date,
    needsCeoApproval: {
        type: Boolean,
        default: false
    },
    ceoApproval: {
        approved: { type: Boolean, default: false },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        approvedAt: Date,
        comments: String
    }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);