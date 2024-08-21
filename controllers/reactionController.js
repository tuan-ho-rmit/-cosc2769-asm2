exports.addOrUpdateCommentReaction = async (req, res) => {
    const { type } = req.body;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        let reaction = await Reaction.findOne({ comment: commentId, user: userId });

        if (reaction) {
            // Update existing reaction
            reaction.type = type;
            await reaction.save();
        } else {
            // Create new reaction
            reaction = new Reaction({
                type,
                user: userId,
                comment: commentId,
            });
            await reaction.save();
        }

        res.json(reaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
