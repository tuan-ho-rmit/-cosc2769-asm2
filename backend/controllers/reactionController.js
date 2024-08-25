// controllers/reactionController.js

import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// controllers/reactionController.js

export const addReaction = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { reaction } = req.body;

        // 세션에서 user가 존재하는지 확인
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const userId = req.session.user.id; // 예시로 세션에서 가져오는 경우

        if (!reaction) {
            return res.status(400).json({ message: 'Reaction type is required' });
        }

        if (postId) {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            post.reactions.push({ userId, type: reaction }); // userId가 존재해야 함
            await post.save();
            res.status(200).json({ message: 'Reaction added to post', reaction: post.reactions });
        } else if (commentId) {
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            comment.reactions.push({ userId, type: reaction }); // userId가 존재해야 함
            await comment.save();
            res.status(200).json({ message: 'Reaction added to comment', reaction: comment.reactions });
        } else {
            res.status(400).json({ message: 'Invalid request parameters' });
        }
    } catch (error) {
        console.error('Error adding reaction:', error); // 서버 로그에 에러 출력
        res.status(500).json({ message: 'Error adding reaction', error: error.message });
    }
};



// 리액션 제거 (포스트/댓글 공통)
export const removeReaction = async (req, res) => {
  const { postId, commentId, reactionId } = req.params;
  const userId = req.session.user.id; // 세션에서 사용자 ID 가져오기

  try {
    let target; // 리액션이 제거될 대상 (포스트 또는 댓글)

    if (postId) {
      target = await Post.findById(postId);
    } else if (commentId) {
      target = await Comment.findById(commentId);
    }

    if (!target) {
      return res.status(404).json({ message: postId ? 'Post not found' : 'Comment not found' });
    }

    const reactionIndex = target.reactions.findIndex(r => r._id.toString() === reactionId && r.user.toString() === userId);

    if (reactionIndex === -1) {
      return res.status(404).json({ message: 'Reaction not found' });
    }

    target.reactions.splice(reactionIndex, 1); // 리액션 제거
    await target.save();
    res.status(200).json({ message: 'Reaction removed successfully' });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({ message: 'Error removing reaction', error: error.message });
  }
};
