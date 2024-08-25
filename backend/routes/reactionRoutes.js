import express from 'express';
import { addOrUpdateReaction, addOrUpdateCommentReaction, removeReaction, removeCommentReaction, getUserReactionForPost, getUserReactionForComment } from '../controllers/reactionController.js';

const router = express.Router();

// 리액션 추가
router.post('/posts/:postId/reactions', addOrUpdateReaction);
// 댓글 리액션 추가 또는 업데이트
router.post('/comments/:commentId/reactions', addOrUpdateCommentReaction);

// 리액션 제거
router.delete('/posts/:postId/reactions', removeReaction);
// 댓글 리액션 삭제
router.delete('/comments/:commentId/reactions', removeCommentReaction);

// 특정 포스트 또는 댓글에 대한 사용자 리액션 가져오기
// 사용자가 특정 포스트에 남긴 리액션 가져오기
router.get('/posts/:postId/reactions/user', getUserReactionForPost);
router.get('/comments/:commentId/reactions/user', getUserReactionForComment);
export default router;