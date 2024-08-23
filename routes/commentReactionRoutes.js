import express from 'express';
import { reactToComment, getReactionsByComment } from '../controllers/commentReactionController';

const router = express.Router();

router.post('/', reactToComment); // React to a comment
router.get('/:commentId', getReactionsByComment); // Get reactions for a comment

module.exports = router;