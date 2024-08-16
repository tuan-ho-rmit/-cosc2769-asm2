const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.addComment = async (req, res) => {
    const { text } = req.body;
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = new Comment({
            text,
            user: userId,
            post: postId,
        });

        await comment.save();
        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
