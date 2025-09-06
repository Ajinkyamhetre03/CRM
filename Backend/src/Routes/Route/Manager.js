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


router.get('/users/:userId', async (req,res)=>{
  const {userId} = req.params;
  const attendance = await Attendance.find({user : userId})
  res.status(200).json({ success: true, data: attendance });
});


router.put('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, totalHours, status, remarks } = req.body;
      console.log(req.body);
      
    if (!status || !remarks) {
      return res
        .status(400)
        .json({ success: false, message: "status or remarks missing" });
    }

    // Find if attendance already exists for that user + date
    let attendance = await Attendance.findOne({ user: userId, date });

    if (attendance) {
      // Update existing record
      attendance.status = status;
      attendance.remarks = remarks;
      attendance.totalHours = totalHours;
      await attendance.save();
    } else {
      // Create new record
      const markupdated = `${remarks} -:{marked by $(req.user.username})` 
      attendance = new Attendance({
        user: userId,
        date,
        totalHours,
        status,
        remarks:markupdated,
        source: "web",
      });
      await attendance.save();
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


//status:{["full-day", "half-day", "absent", "remote", "on-leave" ,"paid-leave","sick-leave","weekend", "holiday", "checked-in"],
     

export default router;