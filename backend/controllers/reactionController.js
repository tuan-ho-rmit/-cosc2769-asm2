// controllers/reactionController.js

import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// controllers/reactionController.js

export const getPostById = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId)
        .populate('author', 'firstName lastName avatar')
        .populate('reactions.userId', 'firstName lastName avatar'); // 리액션 작성자의 정보도 포함하여 가져옴
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
  };

  // 특정 포스트에 대한 사용자의 리액션 가져오기
export const getUserReactionForPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session.user?.id; // 세션에서 사용자 ID 가져오기
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // 특정 포스트에서 사용자의 리액션 찾기
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
// 리액션 추가 또는 업데이트
export const addOrUpdateReaction = async (req, res) => {
    try {
      const { postId } = req.params;
      const { reaction } = req.body;
      const userId = req.session.user?.id; // 세션에서 사용자 ID 가져오기
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // 사용자의 기존 리액션을 찾아서 업데이트
      const existingReactionIndex = post.reactions.findIndex(
        (r) => r.userId.toString() === userId
      );
  
      if (existingReactionIndex !== -1) {
        // 리액션이 이미 존재하면 업데이트
        post.reactions[existingReactionIndex].type = reaction;
      } else {
        // 리액션이 없다면 새로 추가
        post.reactions.push({ userId, type: reaction });
      }
  
      await post.save();
      res.status(200).json({ message: 'Reaction added or updated successfully', reactions: post.reactions });
    } catch (error) {
      console.error('Error adding or updating reaction:', error);
      res.status(500).json({ message: 'Error adding or updating reaction', error: error.message });
    }
  };
  
// 리액션 삭제
export const removeReaction = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.session.user?.id; // 세션에서 사용자 ID 가져오기
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // 사용자의 리액션을 찾아 삭제
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