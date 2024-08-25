import express from "express";
import {createFriendRequest, getAllFriendRequests, getUserFriendsList} from "../controllers/friendRequestController.js";

const router = express.Router();
router.post ('/', createFriendRequest)
router.get ('/', getAllFriendRequests)
router.get ('/friendslist/:id', getUserFriendsList)

export default router;