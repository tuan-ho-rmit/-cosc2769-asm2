const express = require('express');
const router = express.Router();
const { addOrUpdateReaction, addOrUpdateCommentReaction } = require('../controllers/reactionController');
const auth = require('../middleware/authMiddleware');

router.post('/:postId/reaction', auth, addOrUpdateReaction);
router.post('/comments/:commentId/reaction', auth, addOrUpdateCommentReaction); // New route for comment reactions

module.exports = router;
