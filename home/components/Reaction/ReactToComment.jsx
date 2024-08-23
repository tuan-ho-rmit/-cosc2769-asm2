import React, { useState } from 'react';
import axios from 'axios';

function ReactToComment({ commentId, userId }) {
  const [selectedReaction, setSelectedReaction] = useState(null);

  const handleReaction = async (reactionType) => {
    try {
      await axios.post('/api/comment-reactions', { commentId, userId, type: reactionType });
      setSelectedReaction(reactionType); // Update UI to reflect selected reaction
    } catch (error) {
      console.error('Failed to react to comment', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleReaction('Like')} className={selectedReaction === 'Like' ? 'selected' : ''}>👍 Like</button>
      <button onClick={() => handleReaction('Love')} className={selectedReaction === 'Love' ? 'selected' : ''}>❤️ Love</button>
      <button onClick={() => handleReaction('Haha')} className={selectedReaction === 'Haha' ? 'selected' : ''}>😆 Haha</button>
      <button onClick={() => handleReaction('Angry')} className={selectedReaction === 'Angry' ? 'selected' : ''}>😠 Angry</button>
    </div>
  );
}

export default ReactToComment;