
// models/Payroll.js
const payrollStatuses = ['draft', 'calculated', 'approved', 'paid'];

const payrollSchema = new mongoose.Schema({
    payrollId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        match: /^PAY\d{3,}$/ // Example: PAY001
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    allowances: {
        hra: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        medical: { type: Number, default: 0 },
        others: { type: Number, default: 0 }
    },
    bonuses: {
        performance: { type: Number, default: 0 },
        festival: { type: Number, default: 0 },
        others: { type: Number, default: 0 }
    },
    deductions: {
        pf: { type: Number, default: 0 },
        esi: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        advance: { type: Number, default: 0 },
        others: { type: Number, default: 0 }
    },
    overtimeHours: {
        type: Number,
        default: 0
    },
    overtimeRate: {
        type: Number,
        default: 0
    },
    workingDays: {
        type: Number,
        required: true
    },
    presentDays: {
        type: Number,
        required: true
    },
    absentDays: {
        type: Number,
        default: 0
    },
    leaveDays: {
        type: Number,
        default: 0
    },
    grossSalary: {
        type: Number,
        required: true
    },
    totalDeductions: {
        type: Number,
        required: true
    },
    netSalary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: payrollStatuses,
        default: 'draft'
    },
    calculatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paidDate: Date,
    payslipGenerated: {
        type: Boolean,
        default: false
    },
    payslipUrl: String
}, { timestamps: true });

// Compound index to ensure one payroll per employee per month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);