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

    console.log(`Updating comment with ID: ${commentId}`); // 콘솔 로그 추가
    console.log(`New content: ${content}`); // 콘솔 로그 추가

    try {
        // 댓글을 먼저 찾아서 이전 내용을 가져옵니다.
        const comment = await Comment.findById(commentId);
        if (!comment) {
            console.error(`Comment with ID ${commentId} not found`); // 콘솔 로그 추가
            return res.status(404).json({ message: "Comment not found" });
        }

        // history에 이전 내용을 추가합니다.
        const previousContent = comment.content;
        comment.history.push({
            modifiedBy: req.session.user.id, // 현재 사용자를 수정자로 설정
            modifiedAt: new Date(), // 현재 시간을 수정 시간으로 설정
            previousContent: previousContent, // 이전 내용을 history에 저장
        });

        console.log(`Previous content added to history: ${previousContent}`); // 콘솔 로그 추가

        // 새로운 내용으로 업데이트합니다.
        comment.content = content;
        comment.date = new Date(); // 업데이트 시간을 현재 시간으로 설정

        // 댓글을 저장합니다.
        const updatedComment = await comment.save();
        console.log(`Comment updated successfully: ${updatedComment}`); // 콘솔 로그 추가

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

export const getCommentHistory = async (commentId) => {
    try {
        const comment = await Comment.findById(commentId)
            .select('history')
            .populate('history.modifiedBy', 'firstName lastName avatar');

        if (!comment) {
            return { status: 404, data: { message: "Comment not found" } };
        }

        return { status: 200, data: comment.history };
    } catch (error) {
        console.error('Error fetching comment history:', error);
        return { status: 500, data: { message: "Error fetching comment history", error } };
    }
};
// 댓글 수정 이력 가져오기 라우터 함수
export const getCommentHistoryRoute = async (req, res) => {
    const { commentId } = req.params; // URL에서 commentId를 가져옵니다.
  
    try {
      // 댓글 수정 이력을 가져오는 함수 호출
      const result = await getCommentHistory(commentId);
  
      // 상태 코드에 따라 응답 전송
      res.status(result.status).json(result.data);
    } catch (error) {
      console.error('Error in fetching comment history route:', error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };