// routes/manager/task.js
import express from "express";
import { auth } from '../../middleware/auth.js'
import { checkRoleAndDepartment } from '../../middleware/roleCheck.js'
import {
  GetTask, 
  getTaskById,
  addNoteToTask,
  deleteNoteFromTask,
  editTask
} from '../Controllers/Employee/Task.js'

const router = express.Router();

// Auth checker
router.use(auth);
router.use(
  checkRoleAndDepartment(
    ["employee"],  
    ['hr', 'iot', 'software', 'financial', 'business'] 
  )
);


router.get('/tasks', GetTask);
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', editTask);

router.post('/tasks/:id/notes', addNoteToTask);
router.delete('/tasks/:taskId/notes/:noteId', deleteNoteFromTask);

export default router;