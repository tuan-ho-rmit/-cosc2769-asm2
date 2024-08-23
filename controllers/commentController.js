import Comment from '../models/Comment.js';

// Create a Comment
exports.createComment = async (req, res) => {
    const { postId, userId, content } = req.body;
  
    try {
      const comment = await Comment.create({ postId, userId, content });
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment.' });
    }
  };
  
  // Get Comments for a Post
  exports.getCommentsByPost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await Comment.findAll({ where: { postId } });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve comments.' });
    }
  };