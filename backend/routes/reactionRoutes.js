import express from 'express';
import { addReaction, removeReaction } from '../controllers/reactionController.js';

const router = express.Router();

// 리액션 추가
router.post('/posts/:postId/reactions', addReaction);
router.post('/comments/:commentId/reactions', addReaction);

// 리액션 제거
router.delete('/posts/:postId/reactions/:reactionId', removeReaction);
router.delete('/comments/:commentId/reactions/:reactionId', removeReaction);

export default router;