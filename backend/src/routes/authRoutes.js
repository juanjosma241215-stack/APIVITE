import { Router } from 'express';
import {
  getProfile,
  loginUser,
  registerUser,
  updateBudget
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:userId', getProfile);
router.put('/budget', updateBudget);

export default router;
