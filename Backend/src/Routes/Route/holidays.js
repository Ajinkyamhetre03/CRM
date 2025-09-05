// routes/holidays.js
import express from "express";
import { auth } from "../../middleware/auth.js";
import { checkRoleAndDepartment } from "../../middleware/roleCheck.js";
import Holiday from "../../Models/Holiday.js";

const router = express.Router();
router.use(auth);

// ================== GET ALL HOLIDAYS ==================
router.get("/", async (req, res) => {
  try {
    const { year, month, type } = req.query;
    let query = { isActive: true };

    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    if (type) {
      query.type = type;
    }

    const holidays = await Holiday.find(query)
      .populate('createdBy', 'username email')
      .sort({ date: 1 });

    res.json({ holidays });
  } catch (error) {
    console.error("Fetch holidays error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================== CREATE HOLIDAY (Admin/HR) ==================
router.post("/", 
  checkRoleAndDepartment(["admin", "superadmin", "ceo"], ["hr"]),
  async (req, res) => {
    try {
      const { name, date, description, type, isRecurring, departments } = req.body;

      if (!name || !date) {
        return res.status(400).json({ error: "Name and date are required" });
      }

      const holidayDate = new Date(date);
      if (isNaN(holidayDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      // Check if holiday already exists for this date
      const existingHoliday = await Holiday.findOne({
        date: {
          $gte: new Date(holidayDate.setHours(0, 0, 0, 0)),
          $lt: new Date(holidayDate.setHours(23, 59, 59, 999))
        },
        isActive: true
      });

      if (existingHoliday) {
        return res.status(400).json({ 
          error: "A holiday already exists for this date" 
        });
      }

      const holiday = new Holiday({
        name,
        date: holidayDate,
        description,
        type: type || "company",
        isRecurring: isRecurring || false,
        departments,
        createdBy: req.user._id
      });

      await holiday.save();
      await holiday.populate('createdBy', 'username email');

      res.status(201).json({
        message: "Holiday created successfully",
        holiday
      });

    } catch (error) {
      console.error("Create holiday error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ================== UPDATE HOLIDAY ==================
router.put("/:holidayId", 
  checkRoleAndDepartment(["admin", "superadmin", "ceo"], ["hr"]),
  async (req, res) => {
    try {
      const { holidayId } = req.params;
      const { name, date, description, type, isRecurring, departments } = req.body;

      const holiday = await Holiday.findById(holidayId);
      if (!holiday) {
        return res.status(404).json({ error: "Holiday not found" });
      }

      if (name) holiday.name = name;
      if (date) {
        const holidayDate = new Date(date);
        if (isNaN(holidayDate)) {
          return res.status(400).json({ error: "Invalid date format" });
        }
        holiday.date = holidayDate;
      }
      if (description !== undefined) holiday.description = description;
      if (type) holiday.type = type;
      if (isRecurring !== undefined) holiday.isRecurring = isRecurring;
      if (departments !== undefined) holiday.departments = departments;

      await holiday.save();
      await holiday.populate('createdBy', 'username email');

      res.json({
        message: "Holiday updated successfully",
        holiday
      });

    } catch (error) {
      console.error("Update holiday error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ================== DELETE HOLIDAY ==================
router.delete("/:holidayId", 
  checkRoleAndDepartment(["admin", "superadmin", "ceo"], ["hr"]),
  async (req, res) => {
    try {
      const { holidayId } = req.params;

      const holiday = await Holiday.findById(holidayId);
      if (!holiday) {
        return res.status(404).json({ error: "Holiday not found" });
      }

      holiday.isActive = false;
      await holiday.save();

      res.json({ message: "Holiday deleted successfully" });

    } catch (error) {
      console.error("Delete holiday error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ================== GET UPCOMING HOLIDAYS ==================
router.get("/upcoming", async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const holidays = await Holiday.find({
      date: { $gte: today },
      isActive: true
    })
    .populate('createdBy', 'username email')
    .sort({ date: 1 })
    .limit(parseInt(limit));

    res.json({ holidays });
  } catch (error) {
    console.error("Fetch upcoming holidays error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;