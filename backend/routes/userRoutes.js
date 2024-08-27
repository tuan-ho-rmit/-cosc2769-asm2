
import express from "express";
import { activateUser, deactivateUser, getListUser, updateUserProfile, getUserDetails } from "../controllers/userController.js";
// import {verifyAdmin} from "../util/verifyToken.js"

const router = express.Router();

// get list users
router.get("/list", getListUser);
router.put("/activate/:id", activateUser);
router.put("/deactivate/:id", deactivateUser);
router.put('/profile', updateUserProfile);
router.get('/:userId', getUserDetails);
export default router;
