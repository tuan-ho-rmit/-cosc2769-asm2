import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Add a comment to a post
exports.addComment = async (req, res) => {
    const { postId } = req.params;
    const { text } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = new Comment({
            text,
            user: req.user.id,
            post: postId,
        });

        await comment.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get comments for a post
exports.getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ post: postId }).populate('user', ['name']);
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};