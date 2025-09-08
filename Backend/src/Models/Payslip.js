import mongoose from "mongoose";

const earningSchema = new mongoose.Schema({
  type: { type: String, required: true },       // e.g., Basic, HRA, Conveyance
  amount: { type: Number, required: true },     // Current month amount
  ytdAmount: { type: Number, required: true },  // Year-to-date amount
});

const deductionSchema = new mongoose.Schema({
  type: { type: String, required: true },       // e.g., EPF, Professional Tax
  amount: { type: Number, required: true },     // Current month deduction
  ytdAmount: { type: Number, required: true },  // Year-to-date deduction
});

const payslipSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    payPeriod: { type: String, required: true },       // e.g., "July 2025"
    payDate: { type: Date, required: true },
    paidDays: { type: Number, required: true },
    lopDays: { type: Number, default: 0 },
    grossEarnings: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    netPay: { type: Number, required: true },
    amountInWords: { type: String },
    earnings: [earningSchema],       // Embedded array of earnings
    deductions: [deductionSchema],   // Embedded array of deductions
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin/Manager who created
    remarks: String
  },
  { timestamps: true }
);

export default mongoose.model("Payslip", payslipSchema);
