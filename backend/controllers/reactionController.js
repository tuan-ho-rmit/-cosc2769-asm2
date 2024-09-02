// controllers/reactionController.js

import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import {createNoti} from "../services/notiService.js";

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

      // add Notification
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


// comment reaction

export const getUserReactionForComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.session.user?.id; // 세션에서 사용자 ID 가져오기
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      // 특정 댓글에서 사용자의 리액션 찾기
      const comment = await Comment.findById(commentId).select('reactions');
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const userReaction = comment.reactions.find(
        (reaction) => reaction.userId.toString() === userId
      );
  
      if (!userReaction) {
        return res.status(200).json({ reaction: null }); // 사용자가 리액션을 남기지 않은 경우
      }
  
      res.status(200).json({ reaction: userReaction.type });
    } catch (error) {
      console.error('Error fetching user reaction for comment:', error);
      res.status(500).json({ message: 'Error fetching user reaction for comment', error: error.message });
    }
  };

// 댓글에 리액션 추가 또는 업데이트
export const addOrUpdateCommentReaction = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { reaction } = req.body;
      const userId = req.session.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const existingReactionIndex = comment.reactions.findIndex(
        (r) => r.userId.toString() === userId
      );
  
      if (existingReactionIndex > -1) {
        // 리액션이 이미 존재하면 업데이트
        comment.reactions[existingReactionIndex].type = reaction;
      } else {
        // 리액션이 존재하지 않으면 새로 추가
        comment.reactions.push({ userId, type: reaction });
      }
  
      await comment.save();
      res.status(200).json(comment.reactions);
    } catch (error) {
      console.error('Error adding or updating comment reaction:', error);
      res.status(500).json({ message: 'Error adding or updating comment reaction', error: error.message });
    }
  };
  
  // 댓글 리액션 삭제
  export const removeCommentReaction = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.session.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: 'User is not logged in' });
      }
  
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // 사용자 리액션 삭제
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

// 댓글에 리액션 개수 가져오기
export const getCommentReactionsCount = async (req, res) => {
  try {
    const { commentId } = req.params;
    
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