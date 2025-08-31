// Controllers/Manager/Task.js
import User from "../../../Models/User.js";
import Task from "../../../Models/Task.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({
      department: req.user.department,
      role: { $in: ["employee", "intern"] }
    }).select("-password");
    
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

export const CreateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    if (!title || !description || !assignedTo || assignedTo.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const task = new Task({
      title,
      description,
      department: req.user.department,
      assignedBy: req.user._id,
      assignedTo,
      status: status || "pending",
      priority: priority || "medium",
      dueDate
    });

    task.activityLog.push({
      action: "Task Created",
      user: req.user._id
    });

    const savedTask = await task.save();
    await savedTask.populate('assignedTo assignedBy', 'username employeeCode');

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: savedTask
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, could not create task",
      error: error.message
    });
  }
};

export const GetTask = async (req, res) => {
  try {
    const tasks = await Task.find({
      department: req.user.department
    })
    .populate('assignedTo assignedBy', 'username employeeCode email')
    .populate('notes.user', 'username employeeCode')
    .populate('activityLog.user', 'username')
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching tasks", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo assignedBy', 'username employeeCode email')
      .populate('notes.user', 'username employeeCode')
      .populate('activityLog.user', 'username');

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching task", error: error.message });
  }
};

export const editTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate, progress } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Update task fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (progress !== undefined) task.progress = progress;
    
    task.updatedAt = new Date();

    // Add activity log
    task.activityLog.push({
      action: "Task Updated",
      user: req.user._id
    });

    const updatedTask = await task.save();
    await updatedTask.populate('assignedTo assignedBy', 'username employeeCode email');

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await Task.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting task", error: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ department: req.user.department });
    const pendingTasks = await Task.countDocuments({ department: req.user.department, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ department: req.user.department, status: 'in-progress' });
    const completedTasks = await Task.countDocuments({ department: req.user.department, status: 'completed' });

    const priorityStats = await Task.aggregate([
      { $match: { department: req.user.department } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        priority: priorityStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats", error: error.message });
  }
};

export const addNoteToTask = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    task.notes.push({
      user: req.user._id,
      message
    });

    task.activityLog.push({
      action: "Note Added",
      user: req.user._id
    });

    await task.save();
    await task.populate('notes.user', 'username employeeCode');

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding note", error: error.message });
  }
};

export const editNoteInTask = async (req, res) => {
  try {
    const { message } = req.body;
    const { taskId, noteId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const note = task.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.message = message;
    task.activityLog.push({
      action: "Note Edited",
      user: req.user._id
    });

    await task.save();
    await task.populate('notes.user', 'username employeeCode');

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating note", error: error.message });
  }
};

export const deleteNoteFromTask = async (req, res) => {
  try {
    const { taskId, noteId } = req.params;

    // Find the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if the user has permission to delete the note (must be in the same department)
    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Check if the note exists in the task's notes array
    const note = task.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // Use pull() to remove the note from the notes array
    task.notes.pull({ _id: noteId });

    // Add activity log for note deletion
    task.activityLog.push({
      action: "Note Deleted",
      user: req.user._id,
    });

    // Save the updated task
    await task.save();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting note", error: error.message });
  }
};

