import express from 'express';
import router from './authRoutes';
import { addOrUpdateReaction, addOrUpdateCommentReaction } from "../controllers/reactionController";

const router = express.Router();

router.post('/:postId/reaction', auth, addOrUpdateReaction);
router.post('/comments/:commentId/reaction', auth, addOrUpdateCommentReaction); // New route for comment reactions

module.exports = router;
