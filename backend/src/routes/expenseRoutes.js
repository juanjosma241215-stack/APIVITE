import { Router } from 'express';
import {
  createExpense,
  deleteExpense,
  getExpenses,
  resetExpenses,
  updateExpense
} from '../controllers/expenseController.js';

const router = Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.post('/reset', resetExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
