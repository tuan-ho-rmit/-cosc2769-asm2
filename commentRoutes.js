const express = require('express');
const router = express.Router();
const { addComment } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

router.post('/:postId/comment', auth, addComment);

module.exports = router;
