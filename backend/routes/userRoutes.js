import express from 'express';
import { getFriendRequests } from '../controllers/userController';
import auth from  '../middleware/auth';

const router = express.Router();

router.get('/friend-requests', auth, getFriendRequests);

module.exports = router;