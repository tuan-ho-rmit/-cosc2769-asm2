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