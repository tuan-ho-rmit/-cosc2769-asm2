// controllers/reactionController.js

import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import {createNoti} from "../services/notiService.js";

// Get a specific post by its ID and include reactions
export const getPostById = async (req, res) => {
    try {
      const { postId } = req.params;
      // Find post by ID and populate author and reactions (with user details)
      const post = await Post.findById(postId)
        .populate('author', 'firstName lastName avatar')
        .populate('reactions.userId', 'firstName lastName avatar'); // Include the details of users who reacted
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};

// Get the user's specific reaction to a post
export const getUserReactionForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session.user?.id; // Get user ID from session
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // Find the post and look for the user's reaction in the reactions array
      const post = await Post.findById(postId).select('reactions');
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const userReaction = post.reactions.find(
        (reaction) => reaction.userId.toString() === userId
      );
  
      res.status(200).json({ reaction: userReaction?.reaction || null });
    } catch (error) {
      console.error('Error fetching user reaction for post:', error);
      res.status(500).json({ message: 'Error fetching user reaction for post', error: error.message });
    }
};

// Add or update the user's reaction to a post
export const addOrUpdateReaction = async (req, res) => {
    try {
      const { postId } = req.params;
      const { reaction } = req.body;
      const userId = req.session.user?.id; // Get user ID from session
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the user already reacted, if so, update the reaction type
      const existingReactionIndex = post.reactions.findIndex(
        (r) => r.userId.toString() === userId
      );
  
      if (existingReactionIndex !== -1) {
        post.reactions[existingReactionIndex].type = reaction;
      } else {
        // If no reaction exists, add a new one
        post.reactions.push({ userId, type: reaction });
      }
  
      await post.save();

      // Send a notification to the post author about the new reaction
      const existedPost = await Post.findById(postId).populate('author');
      await createNoti(
          'New comment on your post',
          [existedPost.author._id],
          'unread',
          `/user/${existedPost.userId}`
      );

      res.status(200).json({ message: 'Reaction added or updated successfully', reactions: post.reactions });
    } catch (error) {
      console.error('Error adding or updating reaction:', error);
      res.status(500).json({ message: 'Error adding or updating reaction', error: error.message });
    }
};

// Remove the user's reaction from a post
export const removeReaction = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session.user?.id; // Get user ID from session
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Filter out the user's reaction from the post
      post.reactions = post.reactions.filter(
        (r) => r.userId.toString() !== userId
      );
  
      await post.save();
      res.status(200).json({ message: 'Reaction removed successfully', reactions: post.reactions });
    } catch (error) {
      console.error('Error removing reaction:', error);
      res.status(500).json({ message: 'Error removing reaction', error: error.message });
    }
};

// Get the user's specific reaction to a comment
export const getUserReactionForComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.session.user?.id; // Get user ID from session
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // Find the comment and look for the user's reaction in the reactions array
      const comment = await Comment.findById(commentId).select('reactions');
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const userReaction = comment.reactions.find(
        (reaction) => reaction.userId.toString() === userId
      );
  
      if (!userReaction) {
        return res.status(200).json({ reaction: null }); // If the user hasn't reacted
      }
  
      res.status(200).json({ reaction: userReaction.type });
    } catch (error) {
      console.error('Error fetching user reaction for comment:', error);
      res.status(500).json({ message: 'Error fetching user reaction for comment', error: error.message });
    }
};

// Add or update the user's reaction to a comment
export const addOrUpdateCommentReaction = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { reaction } = req.body;
      const userId = req.session.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // Find the comment by ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Check if the user already reacted, if so, update the reaction type
      const existingReactionIndex = comment.reactions.findIndex(
        (r) => r.userId.toString() === userId
      );
  
      if (existingReactionIndex > -1) {
        comment.reactions[existingReactionIndex].type = reaction;
      } else {
        // If no reaction exists, add a new one
        comment.reactions.push({ userId, type: reaction });
      }
  
      await comment.save();
      res.status(200).json(comment.reactions);
    } catch (error) {
      console.error('Error adding or updating comment reaction:', error);
      res.status(500).json({ message: 'Error adding or updating comment reaction', error: error.message });
    }
};

// Remove the user's reaction from a comment
export const removeCommentReaction = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.session.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // Find the comment by ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Filter out the user's reaction from the comment
      comment.reactions = comment.reactions.filter(
        (reaction) => reaction.userId.toString() !== userId
      );
  
      await comment.save();
      res.status(200).json({ message: 'Reaction removed successfully' });
    } catch (error) {
      console.error('Error removing comment reaction:', error);
      res.status(500).json({ message: 'Error removing comment reaction', error: error.message });
    }
};

// Get the count of reactions for a comment
export const getCommentReactionsCount = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    // Find the comment and count each reaction type
    const comment = await Comment.findById(commentId).select('reactions');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reactionCounts = comment.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(reactionCounts);
  } catch (error) {
    console.error('Error fetching comment reaction counts:', error);
    res.status(500).json({ message: 'Error fetching comment reaction counts', error: error.message });
  }
};
