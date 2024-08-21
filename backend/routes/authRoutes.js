import express from 'express';
import { registerUser, getUsers, loginUser, getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.post('/login', loginUser);
router.get('/user', getCurrentUser);  // Added this route for fetching the logged-in user's info

export default router;
