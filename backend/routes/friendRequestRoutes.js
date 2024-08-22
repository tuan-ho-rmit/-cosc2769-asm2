import express from 'express';
import router from './authRoutes';
import auth from '../middleware/auth';
import {sendFriendRequest, acceptFriendRequest, declineFriendRequest} from "../controllers/friendRequestController"
const router = express.Router();

router.post('/send', sendFriendRequest);
router.put('/accept/:requestId', acceptFriendRequest);
router.put('/decline/:requestId', declineFriendRequest);
router.post('/', auth, sendFriendRequest);

module.exports = router;