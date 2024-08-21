import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ postId }) => {
    const [text, setText] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/posts/${postId}/comment`, { text });
            setText(''); // Clear the input after submission
            // Optionally, trigger a refresh of the comments
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <textarea
                name="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                placeholder="Add a comment..."
            ></textarea>
            <button type="submit">Comment</button>
        </form>
    );
};

export default CommentForm;
