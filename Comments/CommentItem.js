import React, { useState } from 'react';
import CommentReactionButtons from './CommentReactionButtons';
import CommentReactions from './CommentReactions';

const CommentItem = ({ comment }) => {
    const [currentReaction, setCurrentReaction] = useState(null);

    const handleReactionChange = (newReaction) => {
        setCurrentReaction(newReaction);
    };

    return (
        <div>
            <p>{comment.text}</p>
            <CommentReactionButtons commentId={comment._id} onReactionChange={handleReactionChange} />
            <CommentReactions commentId={comment._id} />
        </div>
    );
};

export default CommentItem;
