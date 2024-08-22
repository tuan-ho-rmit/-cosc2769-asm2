import express from 'express';
import { addComment, getComments } from '../controllers/commentController';
import authMiddleware from './middleware/authMiddleware';
const router = express.Router();

router.post('/:postId/comments', authMiddleware, addComment);
router.get('/:postId/comments', getComments)
module.exports = router;
