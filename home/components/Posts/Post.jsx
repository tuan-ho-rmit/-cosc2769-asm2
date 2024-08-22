import React, { useState } from 'react';
import axios from 'axios';

const Post = ({ post }) => {
    const [reaction, setReaction] = useState(post.userReaction || '');

    const handleReaction = async (type) => {
        try {
            await axios.post('/api/reactions/post', { postId: post._id, reactionType: type });
            setReaction(type);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <h3>{post.text}</h3>
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

export default Post;
