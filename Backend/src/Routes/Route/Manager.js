// routes/manager/task.js
import express from "express";
import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
import User from "../../Models/User.js";
import Attendance from "../../Models/Attendance.js";
import {
  getAllUser, 
  CreateTask, 
  GetTask, 
  editTask, 
  deleteTask,
  getTaskById,
  addNoteToTask,
  editNoteInTask,
  deleteNoteFromTask,
  getTaskStats
} from '../Controllers/Manager/Task.js'



const router = express.Router();


// Auth checker
router.use(auth);
router.use(
  checkRoleAndDepartment(
    ["manager"],  
    ['hr', 'iot', 'software', 'financial', 'business'] 
  )
);



// User routes
router.get('/users', getAllUser);

// Task routes
router.post('/tasks', CreateTask);
router.get('/tasks', GetTask);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', editTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks-stats', getTaskStats);

// Note routes
router.post('/tasks/:id/notes', addNoteToTask);
router.put('/tasks/:taskId/notes/:noteId', editNoteInTask);
router.delete('/tasks/:taskId/notes/:noteId', deleteNoteFromTask);



router.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date query parameter is required." });
    }
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Users in manager's department
    const users = await User.find({
      department: req.user.department,
      role: { $in: ["employee", "intern"] },
    }).select("-password");

    // Attendance records for those users on that date
    const attendanceRecords = await Attendance.find({
      user: { $in: users.map((u) => u._id) },
      date: targetDate,
    });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      attendanceMap[record.user.toString()] = record;
    });

    // Compose response data with attendance or default "absent"
    const results = users.map((user) => {
      const attendance = attendanceMap[user._id.toString()];
      if (attendance) {
        return { user, attendance };
      } else {
        return {
          user,
          attendance: {
            status: "absent",
            totalHours: 0,
            sessions: [],
            remarks: "",
          },
        };
      }
    });

    res.status(200).json({ success: true, date: targetDate, data: results });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attendance", error: error.message });
  }
});

// Update or create attendance for a user on a date
router.put("/attendance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, status, remarks, sessions } = req.body;

    if (!date || !status) {
      return res.status(400).json({
        success: false,
        message: "Date and status are required.",
      });
    }
    if (!remarks || remarks.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required when updating attendance.",
      });
    }

    // Verify user is in manager's department
    const user = await User.findById(userId);
    if (!user || user.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ user: userId, date: targetDate });
    if (!attendance) {
      attendance = new Attendance({ user: userId, date: targetDate });
    }

    attendance.status = status;
    attendance.remarks = remarks;
    attendance.sessions = sessions || [];

    // Recalculate totalHours based on sessions
    if (attendance.sessions.length > 0) {
      attendance.totalHours = attendance.sessions.reduce((total, s) => {
        return total + (s.duration || 0);
      }, 0);
    } else {
      attendance.totalHours = 0;
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update attendance", error: error.message });
  }
});

// Get detailed attendance for a user on a date
router.get("/attendance/:userId/detail", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date query parameter is required." });
    }

    const user = await User.findById(userId);
    if (!user || user.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ user: userId, date: targetDate });
    if (!attendance) {
      return res
        .status(404)
        .json({ success: false, message: "No attendance found for this user on the date" });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attendance details", error: error.message });
  }
});




export default router;