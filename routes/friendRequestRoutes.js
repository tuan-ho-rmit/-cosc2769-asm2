import express from 'express';
import {sendFriendRequest, acceptFriendRequest, rejectFriendRequest} from "../controllers/friendRequestController"
const router = express.Router();

router.post('/send', sendFriendRequest); // Send a friend request
router.post('/accept/:requestId', acceptFriendRequest); // Accept a friend request
router.post('/reject/:requestId', rejectFriendRequest); // Reject a friend request

module.exports = router;