// routes/leaves.js
import express from "express";
import { auth } from "../../middleware/auth.js";
import { checkRoleAndDepartment } from "../../middleware/roleCheck.js";
import LeaveRequest from "../../Models/LeaveRequest.js";
import LeaveBalance from "../../Models/LeaveBalance.js";
import User from "../../Models/User.js";

const router = express.Router();
router.use(auth);

// ================== APPLY FOR LEAVE ==================
router.post("/apply", async (req, res) => {
  try {
    const userId = req.user._id;
    const { leaveType, startDate, endDate, reason, emergencyContact } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ error: "Start date cannot be after end date" });
    }

    // Calculate total days (excluding weekends for some leave types)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    const currentYear = new Date().getFullYear();
    let leaveBalance = await LeaveBalance.findOne({ user: userId, year: currentYear });
    
    if (!leaveBalance) {
      // Create default balance if doesn't exist
      leaveBalance = new LeaveBalance({
        user: userId,
        year: currentYear
      });
      await leaveBalance.save();
    }

    // Check if user has sufficient balance
    const leaveTypeBalance = leaveBalance[leaveType];
    if (leaveTypeBalance && (leaveTypeBalance.allocated - leaveTypeBalance.used) < totalDays) {
      return res.status(400).json({ 
        error: `Insufficient ${leaveType} leave balance. Available: ${leaveTypeBalance.allocated - leaveTypeBalance.used} days` 
      });
    }

    // Find user's manager
    const user = await User.findById(userId);
    let managerId = user.manager;
    
    // If no manager assigned, find by role hierarchy
    if (!managerId) {
      const manager = await User.findOne({
        department: user.department,
        role: { $in: ["manager", "admin", "superadmin"] }
      }).sort({ role: 1 });
      
      if (!manager) {
        return res.status(400).json({ error: "No manager found to approve leave request" });
      }
      managerId = manager._id;
    }

    // Check for overlapping leave requests
    const overlapping = await LeaveRequest.findOne({
      user: userId,
      status: { $in: ["pending", "approved"] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ 
        error: "You have an overlapping leave request for this period" 
      });
    }

    // Create leave request
    const leaveRequest = new LeaveRequest({
      user: userId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      appliedTo: managerId,
      emergencyContact
    });

    await leaveRequest.save();
    await leaveRequest.populate(['user', 'appliedTo']);

    res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequest
    });

  } catch (error) {
    console.error("Leave application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================== GET MY LEAVE REQUESTS ==================
router.get("/my-requests", async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, year } = req.query;

    let query = { user: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      query.startDate = { $gte: startDate };
      query.endDate = { $lte: endDate };
    }

    const leaveRequests = await LeaveRequest.find(query)
      .populate(['appliedTo', 'approvedBy'])
      .sort({ createdAt: -1 });

    res.json({ leaveRequests });

  } catch (error) {
    console.error("Fetch leave requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================== GET PENDING APPROVALS (Manager) ==================
router.get("/pending-approvals", 
  checkRoleAndDepartment(["manager", "admin", "superadmin", "ceo"], []),
  async (req, res) => {
    try {
      const managerId = req.user._id;

      const pendingRequests = await LeaveRequest.find({
        appliedTo: managerId,
        status: "pending"
      })
      .populate(['user'])
      .sort({ createdAt: -1 });

      res.json({ pendingRequests });

    } catch (error) {
      console.error("Fetch pending approvals error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ================== APPROVE/REJECT LEAVE ==================
router.put("/:requestId/review", 
  checkRoleAndDepartment(["manager", "admin", "superadmin", "ceo"], []),
  async (req, res) => {
    try {
      const { requestId } = req.params;
      const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'
      const managerId = req.user._id;

      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({ error: "Invalid action. Must be 'approve' or 'reject'" });
      }

      const leaveRequest = await LeaveRequest.findOne({
        _id: requestId,
        appliedTo: managerId,
        status: "pending"
      });

      if (!leaveRequest) {
        return res.status(404).json({ error: "Leave request not found or already processed" });
      }

      if (action === "reject" && !rejectionReason) {
        return res.status(400).json({ error: "Rejection reason is required" });
      }

      // Update leave request
      leaveRequest.status = action === "approve" ? "approved" : "rejected";
      leaveRequest.approvedBy = managerId;
      leaveRequest.approvedAt = new Date();
      
      if (rejectionReason) {
        leaveRequest.rejectionReason = rejectionReason;
      }

      await leaveRequest.save();

      // If approved, update leave balance
      if (action === "approve") {
        const currentYear = new Date().getFullYear();
        const leaveBalance = await LeaveBalance.findOne({ 
          user: leaveRequest.user, 
          year: currentYear 
        });

        if (leaveBalance && leaveBalance[leaveRequest.leaveType]) {
          leaveBalance[leaveRequest.leaveType].used += leaveRequest.totalDays;
          await leaveBalance.save();
        }
      }

      await leaveRequest.populate(['user', 'appliedTo', 'approvedBy']);

      res.json({
        message: `Leave request ${action}d successfully`,
        leaveRequest
      });

    } catch (error) {
      console.error("Leave review error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ================== GET LEAVE BALANCE ==================
router.get("/balance", async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    let leaveBalance = await LeaveBalance.findOne({ 
      user: userId, 
      year: targetYear 
    });

    if (!leaveBalance) {
      leaveBalance = new LeaveBalance({
        user: userId,
        year: targetYear
      });
      await leaveBalance.save();
    }

    res.json({ leaveBalance });

  } catch (error) {
    console.error("Fetch leave balance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================== CANCEL LEAVE REQUEST ==================
router.put("/:requestId/cancel", async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const leaveRequest = await LeaveRequest.findOne({
      _id: requestId,
      user: userId,
      status: { $in: ["pending", "approved"] }
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found or cannot be cancelled" });
    }

    // Check if leave has already started
    const today = new Date();
    if (leaveRequest.startDate <= today && leaveRequest.status === "approved") {
      return res.status(400).json({ 
        error: "Cannot cancel leave request that has already started" 
      });
    }

    // If approved leave is being cancelled, restore leave balance
    if (leaveRequest.status === "approved") {
      const currentYear = new Date().getFullYear();
      const leaveBalance = await LeaveBalance.findOne({ 
        user: userId, 
        year: currentYear 
      });

      if (leaveBalance && leaveBalance[leaveRequest.leaveType]) {
        leaveBalance[leaveRequest.leaveType].used -= leaveRequest.totalDays;
        await leaveBalance.save();
      }
    }

    leaveRequest.status = "cancelled";
    await leaveRequest.save();

    res.json({
      message: "Leave request cancelled successfully",
      leaveRequest
    });

  } catch (error) {
    console.error("Cancel leave error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================== TEAM LEAVE CALENDAR (Manager) ==================
router.get("/team-calendar", 
  checkRoleAndDepartment(["manager", "admin", "superadmin", "ceo"], []),
  async (req, res) => {
    try {
      const managerId = req.user._id;
      const { month, year } = req.query;
      
      const currentDate = new Date();
      const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
      const targetYear = year ? parseInt(year) : currentDate.getFullYear();
      
      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 0);

      // Get team members
      const teamMembers = await User.find({ manager: managerId });
      const teamMemberIds = teamMembers.map(member => member._id);

      // Get approved leave requests for the month
      const leaveRequests = await LeaveRequest.find({
        user: { $in: teamMemberIds },
        status: "approved",
        $or: [
          { startDate: { $gte: startDate, $lte: endDate } },
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
        ]
      }).populate(['user']);

      res.json({ 
        month: targetMonth,
        year: targetYear,
        leaveRequests 
      });

    } catch (error) {
      console.error("Team calendar error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;