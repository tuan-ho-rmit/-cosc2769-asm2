// controllers/commentController.js
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const addComment = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const newComment = new Comment({
            postId,
            content,
            author: req.session.user.id,
            date: new Date(),
        });

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const comments = await Comment.find({ postId }).populate('author', 'firstName lastName avatar');
        
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};
// 댓글 업데이트
export const updateComment = async (req, res) => {
    const { commentId } = req.params; // URL에서 commentId를 가져옴
    const { content } = req.body; // 요청 본문에서 새로운 댓글 내용을 가져옴

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId, 
            { content }, // 새로운 내용으로 업데이트
            { new: true } // 업데이트된 문서를 반환하도록 설정
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: "Error updating comment", error });
    }
};

export const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    

    try {
        // 댓글이 존재하는지 확인하고 삭제
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

export const updateCommentInPostDetail = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId, 
            { content },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: "Error updating comment", error });
    }
};

// controllers/commentController.js

export const deleteCommentInPostDetail = async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        console.log(`Deleting comment for postId: ${postId} and commentId: ${commentId}`); // 로그 추가

        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};


// comment reaction

// 특정 댓글에 대한 사용자의 리액션 가져오기
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
  
      res.status(200).json({ reaction: userReaction?.type || null });
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
