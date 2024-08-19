import express from 'express';
import { registerUser, getUsers, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.post('/login', loginUser);

export default router;
