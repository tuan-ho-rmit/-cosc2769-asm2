import express from 'express';
import { registerUser, getUsers, loginUser, logoutUser, getCurrentUser, checkAuth } from '../controllers/authController.js';
import { verifyToken } from '../util/verifyToken.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/users', getUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/user', getCurrentUser);
router.get('/check-auth', verifyToken, (req, res) => {
    // console.log("🚀 ~ router.get ~ req:", req.session.user)
    res.status(200).json({
        success: true,
        message: "User is logged in",
        user: req.session.user,
        rem: req.rememberMe,
    });
});

export default router;
