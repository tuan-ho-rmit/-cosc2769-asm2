import {changeNotiStatus, getAllNoti} from "../controllers/notiController.js";
import express from "express";
import {getUserFriendsList} from "../controllers/friendRequestController.js";

const router = express.Router();

router.get('/', getAllNoti);
// router.post('/', createNoti);
// router.get('/friendslist/:id', getUserFriendsList)
router.patch('/:notificationId/read', changeNotiStatus)
export default router