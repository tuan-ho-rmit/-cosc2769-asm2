import express from 'express';
import { registerUser, getUsers } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getUsers);

export default router;
