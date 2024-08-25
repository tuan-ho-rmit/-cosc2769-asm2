import express from 'express';
import { addOrUpdateReaction, removeReaction, getUserReactionForPost } from '../controllers/reactionController.js';

const router = express.Router();

// 리액션 추가
router.post('/posts/:postId/reactions', addOrUpdateReaction);
// router.post('/comments/:commentId/reactions', addReaction);

// 리액션 제거
router.delete('/posts/:postId/reactions', removeReaction);
router.delete('/comments/:commentId/reactions/:reactionId', removeReaction);

// 특정 포스트 또는 댓글에 대한 사용자 리액션 가져오기
// 사용자가 특정 포스트에 남긴 리액션 가져오기
router.get('/posts/:postId/reactions/user', getUserReactionForPost);
// router.get('/comments/:commentId/user-reaction', getUserReactionForComment);
export default router;