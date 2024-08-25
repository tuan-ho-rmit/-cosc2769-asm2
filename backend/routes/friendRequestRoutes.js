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
router.post ('/acceptFriendRequest', acceptFriendRequest)
router.post ('/rejectFriendRequest', rejectFriendRequest)

export default router;