import express from "express";
import {
    acceptFriendRequest,
    createFriendRequest, findFriendRequest,
    getAllFriendRequests, getPendingFriendRequests,
    getUserFriendsList, rejectFriendRequest,
    deleteFriendRequest, unfriend
} from "../controllers/friendRequestController.js";

const router = express.Router();
router.post ('/', createFriendRequest)
router.get ('/', getAllFriendRequests)
router.get ('/friendslist/:userId', getUserFriendsList)
router.patch ('/:requestId/accept', acceptFriendRequest)
router.patch ('/:requestId/reject', rejectFriendRequest)
router.get('/single/:fromId/:toId', findFriendRequest)
router.delete('/:requestId/delete', deleteFriendRequest)
router.patch('/:requestId/unfriend', unfriend)

export default router;