// routes/commentRoutes.js
import express from 'express';
import { addComment, getCommentsByPostId, updateComment, deleteComment, updateCommentInPostDetail, deleteCommentInPostDetail, getCommentHistoryRoute } from '../controllers/commentController.js';

const router = express.Router();

// Route for creating a new comment
router.post('/:postId/comments', addComment);

// Route for getting comments for a specific post
router.get('/:postId/comments', getCommentsByPostId);

// 댓글 업데이트
router.put('/:postId/comments/:commentId', updateComment);

// 댓글 삭제
router.delete('/:postId/comments/:commentId', deleteComment);

// 댓글 수정
router.put('/posts/:postId/comments/:commentId', updateCommentInPostDetail);

// 댓글 삭제
router.delete('/:postId/comments/:commentId', deleteCommentInPostDetail);

router.get('/comments/:commentId/history', getCommentHistoryRoute); // 경로 수정
export default router;
