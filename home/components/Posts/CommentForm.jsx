import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ postId, fetchComments }) => {
    const [text, setText] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/posts/${postId}/comments`, { text });
            setText('');
            fetchComments(); // Refresh the comments after posting
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment"
            />
            <button type="submit">Comment</button>
        </form>
    );
};

export default CommentForm;
