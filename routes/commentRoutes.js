import express from 'express';
import { addComment, reactToPost, reactToComment } from '../controllers/commentController';

const router = express.Router();

router.post('/:postId/comment', auth, addComment);

module.exports = router;
