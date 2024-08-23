import Reaction from "../models/Reaction";

// React to a Post
exports.reactToPost = async (req, res) => {
    const { postId, userId, type } = req.body;
  
    try {
      // Check if the user has already reacted to this post
      const existingReaction = await Reaction.findOne({
        where: { postId, userId },
      });
  
      if (existingReaction) {
        // Update the reaction type if it already exists
        existingReaction.type = type;
        await existingReaction.save();
        return res.json({ message: 'Reaction updated.', reaction: existingReaction });
      }
  
      // Create a new reaction if none exists
      const reaction = await Reaction.create({ postId, userId, type });
      res.status(201).json({ message: 'Reaction added.', reaction });
    } catch (error) {
      res.status(500).json({ error: 'Failed to react to post.' });
    }
  };
  
  // Get Reactions for a Post
  exports.getReactionsByPost = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const reactions = await Reaction.findAll({ where: { postId } });
      res.json(reactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve reactions.' });
    }
  };