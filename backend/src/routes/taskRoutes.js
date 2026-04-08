import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from '../controllers/taskController.js';

// Router dedicado al recurso "tasks".
const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
