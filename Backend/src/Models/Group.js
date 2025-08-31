import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  members: [{ type: String }], // Array of user emails
  admin: { type: String, required: true }, // Creator email
  avatar: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model.Group|| mongoose.model('Group', groupSchema);