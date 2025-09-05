import express from "express";
import mongoose from "mongoose";
import { auth } from "../../middleware/auth.js";
import { checkRoleAndDepartment } from "../../middleware/roleCheck.js";
import User from "../../Models/User.js";
import Attendance from "../../Models/Attendance.js";

const router = express.Router();

router.use(auth);
router.use(checkRoleAndDepartment(["manager"], ["hr", "iot", "software", "financial", "business"]));

// Get attendance for all users in department on a specific date
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: "Date query parameter is required." });

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Get all users in manager's department (employees and interns)
    const users = await User.find({
      department: req.user.department,
      role: { $in: ["employee", "intern"] }
    }).select("-password -createdAt -updatedAt -__v");

    // Get attendance records for those users on the date
    const attendanceRecords = await Attendance.find({
      user: { $in: users.map(u => u._id) },
      date: targetDate
    });

    // Map attendance by userId for quick lookup
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      attendanceMap[record.user.toString()] = record;
    });

    // Compose response list with attendance or 'absent'
    const results = users.map(u => {
      const attendance = attendanceMap[u._id.toString()];
      if (attendance) {
        return {
          user: u,
          attendance: attendance
        };
      } else {
        return {
          user: u,
          attendance: {
            status: "absent",
            totalHours: 0,
            sessions: [],
            remarks: ""
          }
        };
      }
    });

    return res.status(200).json({ success: true, date: targetDate, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch attendance", error: error.message });
  }
});

// Update or Create attendance for a user on a date
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, status, remarks, sessions } = req.body;
    if (!date || !status) {
      return res.status(400).json({ success: false, message: "Date and status are required." });
    }
    if (!remarks || remarks.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Remarks are required when changing attendance." });
    }

    // Verify user belongs to manager's department
    const user = await User.findById(userId);
    if (!user || user.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied for this user." });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Find existing attendance record or create
    let attendance = await Attendance.findOne({ user: userId, date: targetDate });
    if (!attendance) {
      attendance = new Attendance({ user: userId, date: targetDate });
    }

    attendance.status = status;
    attendance.remarks = remarks;
    attendance.sessions = sessions || [];
    // Recalculate totalHours if sessions provided
    if (attendance.sessions.length > 0) {
      let totalHours = 0;
      attendance.sessions.forEach(s => {
        if (s.duration) totalHours += s.duration;
      });
      attendance.totalHours = totalHours;
    } else {
      attendance.totalHours = 0;
    }

    await attendance.save();

    return res.status(200).json({ success: true, message: "Attendance updated successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update attendance", error: error.message });
  }
});

// Get detailed attendance for a user on a date
router.get("/:userId/detail", async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: "Date query parameter is required." });

    // Validate user access
    const user = await User.findById(userId);
    if (!user || user.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Access denied for this user." });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ user: userId, date: targetDate });
    if (!attendance) {
      return res.status(404).json({ success: false, message: "No attendance found for this user on the date." });
    }

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch attendance details", error: error.message });
  }
});

export default router;
