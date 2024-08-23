import express from 'express';
import { createComment, getCommentsByPost } from '../controllers/commentController';

const router = express.Router();

router.post('/', createComment); // Create a new comment
router.get('/:postId', getCommentsByPost); // Get all comments for a post

module.exports = router;