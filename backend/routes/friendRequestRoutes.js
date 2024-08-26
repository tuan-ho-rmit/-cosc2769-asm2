import express from "express";
import {
    acceptFriendRequest,
    createFriendRequest,
    getAllFriendRequests, getPendingFriendRequests,
    getUserFriendsList, rejectFriendRequest
} from "../controllers/friendRequestController.js";

const router = express.Router();
router.post ('/', createFriendRequest)
router.get ('/', getAllFriendRequests)
router.get ('/friendslist/', getUserFriendsList)
router.patch ('/$requestId/accept', acceptFriendRequest)
router.patch ('/$requestId/reject', rejectFriendRequest)
router.get ('/pending/', getPendingFriendRequests)

export default router;