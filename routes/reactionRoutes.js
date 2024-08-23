import express from 'express';
import { reactToPost, getReactionsByPost } from "../controllers/reactionController";

const router = express.Router();

router.post('/', reactToPost); // React to a post
router.get('/:postId', getReactionsByPost); // Get reactions for a post

module.exports = router;