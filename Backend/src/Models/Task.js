// models/Task.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., "Task Created", "Assigned User", "Note Added"
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },

  department: { 
    type: String, 
    enum: ['hr', 'iot', 'software', 'financial', 'business'],
    required: true
  },

  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Manager
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Employees/Interns

  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  },

  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },

  progress: { type: Number, min: 0, max: 100, default: 0 }, // % completion

  dueDate: { type: Date },

  notes: [noteSchema], // Notes by employees/interns

  activityLog: [activityLogSchema], // History of actions

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
