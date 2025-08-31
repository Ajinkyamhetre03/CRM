// Controllers/Manager/Task.js
import User from "../../../Models/User.js";
import Task from "../../../Models/Task.js";


export const GetTask = async (req, res) => {
    try {
        const tasks = await Task.find({ 
            department: req.user.department, 
            assignedTo: { $in: [req.user._id] } 
        })
        .populate('assignedBy', 'username email')  // Populate 'assignedBy' with selected fields (e.g., name, email)
        .exec();

        res.send({ data:tasks });
        console.log(tasks);
        
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
    const { status,progress } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(405).json({ success: false, message: "Task not found" });
    }

    if (task.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Update task fields

    if (status) task.status = status;
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

