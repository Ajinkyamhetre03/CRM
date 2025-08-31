import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true }, // User email or group ID
  content: { type: String, required: true },
  type: { type: String, enum: ['direct', 'group'], required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  readBy: [{ 
    user: String, 
    readAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

export default  mongoose.model.Message || mongoose.model('Message', messageSchema);