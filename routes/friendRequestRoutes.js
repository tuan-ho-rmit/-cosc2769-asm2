import express from 'express';
import router from './authRoutes';
import auth from '../middleware/auth';
import {sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests} from "../controllers/friendRequestController"
const router = express.Router();

router.post('/', auth, sendFriendRequest);
router.put('/:requestId/accept', auth, acceptFriendRequest);
router.put('/:requestId/reject', auth, rejectFriendRequest);
router.get('/', auth, getFriendRequests);

module.exports = router;