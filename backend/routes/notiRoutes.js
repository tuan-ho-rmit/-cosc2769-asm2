import {createNoti, getAllNoti} from "../controllers/notiController.js";
import express from "express";

const router = express.Router();

router.get('/', getAllNoti);
router.post('/', createNoti);

export default router