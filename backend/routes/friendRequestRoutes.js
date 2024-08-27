import express from "express";
import {
    acceptFriendRequest,
    createFriendRequest, findFriendRequest,
    getAllFriendRequests, getPendingFriendRequests,
    getUserFriendsList, rejectFriendRequest
} from "../controllers/friendRequestController.js";

const router = express.Router();
router.post ('/', createFriendRequest)
router.get ('/', getAllFriendRequests)
router.get ('/friendslist/:userId', getUserFriendsList)
router.patch ('/:requestId/accept', acceptFriendRequest)
router.patch ('/:requestId/reject', rejectFriendRequest)
router.get('/single/:fromId/:toId', findFriendRequest)



router.get ('/pending/', getPendingFriendRequests) // no need

export default router;