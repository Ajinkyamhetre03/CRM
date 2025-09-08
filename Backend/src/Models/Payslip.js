import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    trim: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  ytdAmount: { 
    type: Number, 
    required: true,
    min: [0, 'YTD Amount cannot be negative']
  },
}, { _id: false });

const deductionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    trim: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  ytdAmount: { 
    type: Number, 
    required: true,
    min: [0, 'YTD Amount cannot be negative']
  },
}, { _id: false });

const calculationDetailsSchema = new mongoose.Schema({
  baseSalary: { type: Number, required: true },
  workingDaysInMonth: { type: Number, required: true },
  eligibleWorkingDays: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  leaveDays: { type: Number, default: 0 },
  lopDays: { type: Number, default: 0 }
}, { _id: false });

const payslipSchema = new mongoose.Schema(
  {
    employee: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
    payPeriod: { 
      type: String, 
      required: true,
      trim: true,
      match: [/^[A-Za-z]+ \d{4}$/, 'Pay period must be in format "Month YYYY"']
    },
    payDate: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(date) {
          return date <= new Date();
        },
        message: 'Pay date cannot be in the future'
      }
    },
    paidDays: { 
      type: Number, 
      required: true,
      min: [0, 'Paid days cannot be negative'],
      max: [31, 'Paid days cannot exceed 31']
    },
    lopDays: { 
      type: Number, 
      default: 0,
      min: [0, 'LOP days cannot be negative']
    },
    totalWorkedHours: {
      type: Number,
      default: 0,
      min: [0, 'Total worked hours cannot be negative']
    },
    grossEarnings: { 
      type: Number, 
      required: true,
      min: [0, 'Gross earnings cannot be negative']
    },
    totalDeductions: { 
      type: Number, 
      required: true,
      min: [0, 'Total deductions cannot be negative']
    },
    netPay: { 
      type: Number, 
      required: true,
      validate: {
        validator: function(netPay) {
          return netPay >= 0;
        },
        message: 'Net pay cannot be negative'
      }
    },
    amountInWords: { type: String },
    earnings: [earningSchema],
    deductions: [deductionSchema],
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    remarks: { 
      type: String,
      maxlength: [500, 'Remarks cannot exceed 500 characters']
    },
    
    // New fields for enhanced tracking
    isProRated: { 
      type: Boolean, 
      default: false 
    },
    manualOverride: { 
      type: Boolean, 
      default: false 
    },
    calculationDetails: calculationDetailsSchema,
    status: {
      type: String,
      enum: ['draft', 'approved', 'paid', 'cancelled'],
      default: 'approved'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: Date,
    
    // Audit trail
    revisionNumber: {
      type: Number,
      default: 1
    },
    previousVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payslip"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to prevent duplicate payrolls per employee per period
payslipSchema.index({ employee: 1, payPeriod: 1 }, { unique: true });

// Index for efficient querying
payslipSchema.index({ payDate: -1 });
payslipSchema.index({ createdBy: 1 });
payslipSchema.index({ status: 1 });

// Virtual for formatted pay period
payslipSchema.virtual('formattedPayPeriod').get(function() {
  return this.payPeriod;
});

// Virtual for financial year
payslipSchema.virtual('financialYear').get(function() {
  const year = parseInt(this.payPeriod.split(' ')[1]);
  const month = this.payPeriod.split(' ')[0];
  const monthNum = new Date(`${month} 1, ${year}`).getMonth() + 1;
  
  if (monthNum >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
});

// Pre-save middleware for validations
payslipSchema.pre('save', async function(next) {
  try {
    // Validate that gross earnings equals sum of earnings
    const totalEarnings = this.earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const roundedTotalEarnings = Math.round(totalEarnings * 100) / 100;
    
    if (Math.abs(this.grossEarnings - roundedTotalEarnings) > 0.01) {
      throw new Error(`Gross earnings (${this.grossEarnings}) must equal sum of earnings (${roundedTotalEarnings})`);
    }

    // Validate that total deductions equals sum of deductions
    const totalDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    const roundedTotalDeductions = Math.round(totalDeductions * 100) / 100;
    
    if (Math.abs(this.totalDeductions - roundedTotalDeductions) > 0.01) {
      throw new Error(`Total deductions (${this.totalDeductions}) must equal sum of deductions (${roundedTotalDeductions})`);
    }

    // Validate net pay calculation
    const calculatedNetPay = Math.round((this.grossEarnings - this.totalDeductions) * 100) / 100;
    if (Math.abs(this.netPay - calculatedNetPay) > 0.01) {
      throw new Error(`Net pay (${this.netPay}) must equal gross earnings minus total deductions (${calculatedNetPay})`);
    }

    // Validate paid days and LOP days
    if (this.calculationDetails) {
      const totalDays = this.calculationDetails.presentDays + this.calculationDetails.leaveDays + this.lopDays;
      if (totalDays > this.calculationDetails.workingDaysInMonth + 5) { // Allow some flexibility
        throw new Error('Total days (present + leave + LOP) exceeds working days in month');
      }
    }

    // Auto-increment revision number for existing payrolls
    if (!this.isNew) {
      this.revisionNumber += 1;
      this.updatedBy = this.createdBy; // Will be overridden by the API
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
payslipSchema.methods.calculateTaxes = function() {
  // Calculate various taxes based on earnings
  const annualSalary = this.grossEarnings * 12;
  let incomeTax = 0;
  
  // Simplified tax calculation (you should use actual tax slabs)
  if (annualSalary > 1000000) {
    incomeTax = annualSalary * 0.3 / 12;
  } else if (annualSalary > 500000) {
    incomeTax = annualSalary * 0.2 / 12;
  } else if (annualSalary > 250000) {
    incomeTax = annualSalary * 0.05 / 12;
  }
  
  return {
    incomeTax: Math.round(incomeTax * 100) / 100,
    professionalTax: this.deductions.find(d => d.type.includes('Professional'))?.amount || 0,
    tds: this.deductions.find(d => d.type.includes('TDS'))?.amount || 0
  };
};

payslipSchema.methods.generatePayslipNumber = function() {
  const year = this.payDate.getFullYear();
  const month = String(this.payDate.getMonth() + 1).padStart(2, '0');
  return `PAY${year}${month}${this.employee.toString().slice(-4).toUpperCase()}`;
};

// Static methods
payslipSchema.statics.findByEmployeeAndPeriod = function(employeeId, payPeriod) {
  return this.findOne({ employee: employeeId, payPeriod: payPeriod });
};

payslipSchema.statics.getMonthlyStats = function(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        payDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalPayroll: { $sum: '$netPay' },
        totalEmployees: { $sum: 1 },
        averageSalary: { $avg: '$netPay' },
        totalEarnings: { $sum: '$grossEarnings' },
        totalDeductions: { $sum: '$totalDeductions' }
      }
    }
  ]);
};

payslipSchema.statics.validateBulkPayroll = async function(payrollData) {
  const errors = [];
  const warnings = [];
  
  // Check for duplicates within the bulk data
  const employeePeriods = new Set();
  payrollData.forEach((payroll, index) => {
    const key = `${payroll.employee}-${payroll.payPeriod}`;
    if (employeePeriods.has(key)) {
      errors.push({
        index,
        message: 'Duplicate employee-period combination in bulk data'
      });
    }
    employeePeriods.add(key);
  });
  
  // Check for existing payrolls in database
  const existingPayrolls = await this.find({
    $or: payrollData.map(p => ({
      employee: p.employee,
      payPeriod: p.payPeriod
    }))
  });
  
  if (existingPayrolls.length > 0) {
    warnings.push({
      message: `${existingPayrolls.length} payrolls already exist and will be skipped unless override is used`,
      existing: existingPayrolls.map(p => ({ employee: p.employee, payPeriod: p.payPeriod }))
    });
  }
  
  return { errors, warnings };
};

// Add text search index for better searching
payslipSchema.index({
  'payPeriod': 'text',
  'remarks': 'text'
});

export default mongoose.model("Payslip", payslipSchema);