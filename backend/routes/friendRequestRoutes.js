import express from "express";
import {
    acceptFriendRequest,
    createFriendRequest,
    getAllFriendRequests,
    getUserFriendsList, rejectFriendRequest
} from "../controllers/friendRequestController.js";

const router = express.Router();
router.post ('/', createFriendRequest)
router.get ('/', getAllFriendRequests)
router.get ('/friendslist/:id', getUserFriendsList)
router.patch ('/$requestId/accept', acceptFriendRequest)
router.patch ('/$requestId/reject', rejectFriendRequest)

export default router;