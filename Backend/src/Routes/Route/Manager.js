// routes/manager/task.js
import express from "express";
import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
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

export default router;