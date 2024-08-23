import CommentReaction from '../models/CommentReaction';

// React to a Comment
exports.reactToComment = async (req, res) => {
    const { commentId, userId, type } = req.body;
  
    try {
      // Check if the user has already reacted to this comment
      const existingReaction = await CommentReaction.findOne({
        where: { commentId, userId },
      });
  
      if (existingReaction) {
        // Update the reaction type if it already exists
        existingReaction.type = type;
        await existingReaction.save();
        return res.json({ message: 'Reaction updated.', reaction: existingReaction });
      }
  
      // Create a new reaction if none exists
      const reaction = await CommentReaction.create({ commentId, userId, type });
      res.status(201).json({ message: 'Reaction added.', reaction });
    } catch (error) {
      res.status(500).json({ error: 'Failed to react to comment.' });
    }
  };
  
  // Get Reactions for a Comment
  exports.getReactionsByComment = async (req, res) => {
    const { commentId } = req.params;
  
    try {
      const reactions = await CommentReaction.findAll({ where: { commentId } });
      res.json(reactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reactions.' });
    }
  };