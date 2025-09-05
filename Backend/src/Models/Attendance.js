import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  loginTime: { type: Date, required: true },
  logoutTime: { type: Date },
  deviceInfo: { type: String },
  status: {
    type: String,
    enum: ["active", "closed", "not-logout"],
    default: null,
  },
});

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
 
    sessions: [sessionSchema],
    totalHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["full-day", "half-day", "absent", "remote", "on-leave" ,"paid-leave","sick-leave","weekend", "holiday", "checked-in"],
      default: "absent",
    },
    remarks: String,
    source: { type: String, enum: ["web", "biometric"], default: "web" },
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

if (mongoose.models.Attendance) {
  delete mongoose.models.Attendance;
}
export default mongoose.model("Attendance", attendanceSchema);
