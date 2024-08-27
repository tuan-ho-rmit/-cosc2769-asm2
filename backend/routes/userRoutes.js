
import express from "express";
import { activateUser, deactivateUser, getListUser } from "../controllers/userController.js";
import { verifyAdmin } from "../util/verifyToken.js";

const router = express.Router();

// get list users
router.get("/list", getListUser);
router.put("/activate/:id", activateUser);
router.put("/deactivate/:id", deactivateUser);

export default router;
