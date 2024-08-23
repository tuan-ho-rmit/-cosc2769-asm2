import React from 'react';
import axios from 'axios';

const reactions = ['Like', 'Love', 'Haha', 'Angry'];

const CommentReactionButtons = ({ commentId, onReactionChange }) => {
    const handleReaction = async (type) => {
        try {
            const res = await axios.post(`/api/posts/comments/${commentId}/reaction`, { type });
            onReactionChange(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            {reactions.map((reaction) => (
                <button key={reaction} onClick={() => handleReaction(reaction)}>
                    {reaction}
                </button>
            ))}
        </div>
    );
};

export default CommentReactionButtons;