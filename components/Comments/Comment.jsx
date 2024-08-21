import React, { useState } from 'react';
import axios from 'axios';

const Comment = ({ comment }) => {
    const [reaction, setReaction] = useState(comment.userReaction || '');

    const handleReaction = async (type) => {
        try {
            await axios.post('/api/reactions/comment', { commentId: comment._id, reactionType: type });
            setReaction(type);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <p>{comment.text}</p>
            <div>
                <button onClick={() => handleReaction('Like')}>Like</button>
                <button onClick={() => handleReaction('Love')}>Love</button>
                <button onClick={() => handleReaction('Haha')}>Haha</button>
                <button onClick={() => handleReaction('Angry')}>Angry</button>
            </div>
            <p>Reaction: {reaction}</p>
        </div>
    );
};

export default Comment;
