import express from 'express';
import { registerUser, getUsers, loginUser, logoutUser, getCurrentUser, checkAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // 로그아웃 라우트 추가
router.get('/user', getCurrentUser); // 현재 로그인된 유저 세션 가져오기
router.get('/check-auth', checkAuth);

export default router;
