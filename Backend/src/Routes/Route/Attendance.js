import express from "express";
import { auth } from "../../middleware/auth.js";
import { checkRoleAndDepartment } from "../../middleware/roleCheck.js";
import Attendance from "../../Models/Attendance.js";

const router = express.Router();

// Auth checker
router.use(auth);
router.use(
  checkRoleAndDepartment(
    ["ceo", "superadmin", "admin", "manager", "employee", "intern"],
    ["hr", "iot", "software", "financial", "business"]
  )
);

// ================== CHECK-IN ==================
router.post("/checkin", async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ user: userId, date: today });

    if (!attendance) {
      // Create new record if not exists
      attendance = new Attendance({
        user: userId,
        date: today,
        sessions: [
          { loginTime: new Date(), deviceInfo: req.body.deviceInfo, status: "active" },
        ],
        status: "checked-in",
        source: req.body.source || "web",
      });
      await attendance.save();
      return res.status(201).json({ message: "Checked in successfully", attendance });
    }

    // ✅ Mark all existing "active" sessions as "not-logout"
    attendance.sessions.forEach((session) => {
      if (session.status === "active" && !session.logoutTime) {
        session.status = "not-logout";
      }
    });

    // Add a new session
    attendance.sessions.push({
      loginTime: new Date(),
      deviceInfo: req.body.deviceInfo,
      status: "active",
    });

    attendance.status = "checked-in";
    await attendance.save();

    return res.json({ message: "Checked in successfully", attendance });
  } catch (error) {
    console.error("Check-in error:", error);
    return res.status(500).json({ error: "Internal server error during check-in" });
  }
});


// ================== CHECK-OUT ==================
router.post("/checkout", async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance || attendance.sessions.length === 0) {
      return res.status(400).json({ error: "No active check-in to checkout." });
    }

    const activeSession = attendance.sessions[attendance.sessions.length - 1];
    if (activeSession.logoutTime) {
      return res.status(400).json({ error: "Already checked out." });
    }

    if (activeSession.status === "not-logout") {
      return res
        .status(400)
        .json({ error: "This session was marked as not-logout. Cannot checkout." });
    }

    activeSession.logoutTime = new Date();
    activeSession.status = "closed";

    // Calculate totalHours ignoring "not-logout"
    attendance.totalHours = attendance.sessions.reduce((sum, session) => {
      if (
        session.logoutTime &&
        session.loginTime &&
        session.status !== "not-logout"
      ) {
        return sum + (session.logoutTime - session.loginTime) / (1000 * 60 * 60);
      }
      return sum;
    }, 0);

    // Update status based on totalHours
    if (attendance.totalHours >= 8) {
      attendance.status = "full-day";
    } else if (attendance.totalHours >= 4) {
      attendance.status = "half-day";
    } else {
      attendance.status = "remote"; // or "absent" if <2h
    }

    await attendance.save();
    return res.json({ message: "Checked out successfully", attendance });
  } catch (error) {
    console.error("Check-out error:", error);
    return res.status(500).json({ error: "Internal server error during check-out" });
  }
});

// ================== SEARCH ==================
router.get("/search", async (req, res) => {
  try {
    const userId = req.user._id;
    const { date, month, year } = req.query;

    let start, end;

    if (date) {
      const queryDate = new Date(date);
      if (isNaN(queryDate)) return res.status(400).json({ error: "Invalid date format." });

      start = new Date(queryDate.setHours(0, 0, 0, 0));
      end = new Date(queryDate.setHours(23, 59, 59, 999));

      const attendance = await Attendance.findOne({
        user: userId,
        date: { $gte: start, $lte: end },
      });

      if (!attendance) {
        return res
          .status(404)
          .json({ message: "No attendance record found for this date." });
      }

      return res.json({ type: "daily", attendance });
    } else if (month && year) {
      const m = parseInt(month);
      const y = parseInt(year);
      if (isNaN(m) || isNaN(y)) return res.status(400).json({ error: "Invalid month or year." });

      start = new Date(y, m - 1, 1);
      end = new Date(y, m, 0, 23, 59, 59);

      const records = await Attendance.find({
        user: userId,
        date: { $gte: start, $lte: end },
      }).sort({ date: -1 });

      return res.json({ type: "monthly", records });
    } else if (year) {
      const y = parseInt(year);
      if (isNaN(y)) return res.status(400).json({ error: "Invalid year." });

      start = new Date(y, 0, 1);
      end = new Date(y, 11, 31, 23, 59, 59);

      const records = await Attendance.find({
        user: userId,
        date: { $gte: start, $lte: end },
      }).sort({ date: -1 });

      return res.json({ type: "yearly", records });
    } else {
      const today = new Date();
      start = new Date(today.setHours(0, 0, 0, 0));
      end = new Date(today.setHours(23, 59, 59, 999));

      const attendance = await Attendance.findOne({
        user: userId,
        date: { $gte: start, $lte: end },
      });

      if (!attendance) {
        return res
          .status(404)
          .json({ message: "No attendance record found for today." });
      }

      return res.json({ type: "daily", attendance });
    }
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal server error during search." });
  }
});

export default router;
