import React, { useState } from 'react';
import axios from 'axios';

function CreateComment({ postId, userId }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/comments', { postId, userId, content });
      setContent(''); // Clear the input field after submitting
    } catch (error) {
      console.error('Failed to submit comment', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        required
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}

export default CreateComment;